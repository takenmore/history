/*阻止全局污染*/
(function () {
	var mazemap = [];
	var maze = [];
	var mazem = [];
	//点击导入按钮，使files触发点击事件，然后完成读取文件的操作。
	$("#import").click(function () {
		$("#files").click();
	});
	/*利用H5文件导出功能导出迷宫地图*/
	$("#export").click(function () {
		var content = mazemap.join("\n");
		/*将mazemap数组转换为字符串*/
		var blob = new Blob([content], {
			type: "text/plain;charset=utf-8"
		}); //blob二进制文件储存
		/*生成一个随机的 URL为了a标签点击调用*/
		var objectUrl = URL.createObjectURL(blob);
		/*定义一个a标签通过Jquery模拟点击来*/
		var aForDownload = $("<a download='mazemap.txt'><span class='forExcel'>下载excel</span></a>").attr("href", objectUrl);
		/*添加到body内*/
		$("body").append(aForDownload);
		$(".forExcel").click();
		/*清除a标签不改变原dom树*/
		aForDownload.remove();
	});
	/*监听是否有文件改变，及时更新地图*/
	$("#files").change(function Import() {
		var selectedFile = document.getElementById("files").files[0]; //获取读取的File对象
		var name = selectedFile.name; //读取选中文件的文件名
		var size = selectedFile.size; //读取选中文件的大小
		var reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
		reader.readAsText(selectedFile); //读取文件的内容
		//读取转换为maze地图
		reader.onload = function create() {
			var i, j;
			var rows = 0;
			var cols = 0;
			mazemap = this.result.split("\n"); //this指代filereader对象
			var row = Math.floor(mazemap.length);
			/*切分成为一个个字符*/
			for (j = 0; j < mazemap.length; j++) {
				maze[j] = mazemap[j].split("");
			}
			/*构造迷宫的行*/
			for (i = 0; i < row; i++) {
				$("#mazemap").append("<tr></tr>");
			}
			/*构造迷宫的列，遇0为黑色的墙，1为路*/
			for (rows = 0; rows < maze.length; rows++) {
				for (cols = 0; cols < maze[rows].length; cols++) {
					if (maze[rows][cols] === "1") {
						$("#mazemap").children("tr:eq(" + rows + ")").append("<td style='background: black'></td>");
					}
					if (maze[rows][cols] === "0") {
						$("#mazemap").children("tr:eq(" + rows + ")").append("<td style='background: white'></td>");
					}
				}
			}
			/*深拷贝一份迷宫数组对象备用*/
			mazem = deepCopy(maze);
			/*清除数组中的无用回车符*/
			deleter(mazem);
			/*start 开始点*/
			var start = {};
			start.rowsIndex = Math.floor(maze.length / 2);
			/*因为有回车字符未去除所以-1；*/
			start.colsIndex = Math.floor(maze[0].length / 2) - 1;
			var progress = true;
			/*在开始位置对应的td上添加老鼠*/
			var tr = $("#mazemap").children("tr:eq(" + start.rowsIndex + ")");
			var otd = tr.children("td:eq(" + start.colsIndex + ")");
			otd.append("<div id='mouse'></div>");
			var mouse = $("#mouse");
			mouse.css("width", '30px');
			mouse.css("height", '30px');
			mouse.css('background-image', 'url(img/1096285.png)');
			mouse.css('background-size', '30px 30px');
			/*endlocation 结束位置，在结束位置上添加粮仓位置*/
			var endlocation = {};
			endlocation.rowsIndex = mazem.length - 2;
			endlocation.colsIndex = mazem[0].length - 2;
			var end = $("#mazemap tr:eq(" + endlocation.rowsIndex + ")").children("td:eq(" + endlocation.colsIndex + ")");
			end.append("<div id='liangcang'></div>");
			/*粮仓样式*/
			var liangcang = $("#liangcang");
			liangcang.css("width", '30px');
			liangcang.css("height", '30px');
			liangcang.css('background-image', 'url(img/liangcang.jpg)');
			liangcang.css('background-size', '30px 30px');
			/*计时器启动*/
			time(start);
			//键盘操作
			document.onkeydown = move;

			function move(event) {
				/*移动函数*/
				if (!progress) return; //胜利了之后停止移动函数
				var top = mouse.offset().top;
				var left = mouse.offset().left;
				var trtop = $("#mazemap tr:eq(2)").children("td").offset().top;
				var trtop2 = $("#mazemap tr:eq(3)").children("td").offset().top;
				var trleft = $("#mazemap tr").children("td:eq(1)").offset().left;
				var trleft2 = $("#mazemap tr").children("td:eq(2)").offset().left;
				/*一格的高度*/
				var totop = trtop2 - trtop;
				/*一格的宽度*/
				var toleft = trleft2 - trleft;
				var e = event || window.event; //兼容性处理
				var keyCode = e.keyCode || e.which; //兼容性处理
				var msg = $("#message");
				/*计时器结束判断*/
				if ($("#time").val() === 0 && start.rowsIndex !== endlocation.rowsIndex && start.colsIndex !== endlocation.colsIndex) {
					alert("You lose!");
					msg.text("You lose!");
				}
				/*键盘操作*/
				switch (keyCode) {
					case 87:
						//按下W键
						if (maze[start.rowsIndex - 1][start.colsIndex] === "0") {
							//超出迷宫上界归零
							if (start.rowsIndex >= 0) {
								$("#mouse").offset({
									top: top - totop,
									left: left
								});
								start.rowsIndex--;
								msg.text("Going Up!");
							} else {
								start.rowsIndex = 0;
							}
						}
						if (maze[start.rowsIndex - 1][start.colsIndex] === "1") {
							msg.text("You cannot Go Up! Find another way!");
						}
						break;
					case 65:
						//按下A键
						if (maze[start.rowsIndex][start.colsIndex - 1] === "0") {
							//超出迷宫左界归零
							if (start.colsIndex >= 0) {
								$("#mouse").offset({
									top: top,
									left: left - toleft
								});
								start.colsIndex--;
								msg.text("Going Left!");
							} else {
								start.colsIndex = 0;
							}
						}
						if (maze[start.rowsIndex][start.colsIndex - 1] === "1") {
							msg.text("You cannot Go Left!Find another way!");
						}
						break;
					case 68:
						//按下D键
						if (maze[start.rowsIndex][start.colsIndex + 1] === "0") {
							//超出迷宫右界归零
							if (start.colsIndex <= maze[0].length - 1) {
								$("#mouse").offset({
									top: top,
									left: left + toleft
								});
								start.colsIndex++;
								msg.text("Going Right!");
							} else {
								start.colsIndex = maze[0].length - 1;
							}
						}
						if (maze[start.rowsIndex][start.colsIndex + 1] === "1") {
							msg.text("You cannot Go Right!Find another way!");
						}
						break;
					case 83:
						//按下S键
						if (maze[start.rowsIndex + 1][start.colsIndex] === "0") {
							//超出迷宫下界归零
							if (start.rowsIndex <= row - 1) {
								$("#mouse").offset({
									top: top + totop,
									left: left
								});
								start.rowsIndex++;
								msg.text("Going Down!");
							}
						}
						if (maze[start.rowsIndex + 1][start.colsIndex] === "1") {
							msg.text("You cannot Go down!Find another way!");
						}
						break;
					case 38:
						//按下向↑键
						if (maze[start.rowsIndex - 1][start.colsIndex] === "0") {
							//超出迷宫上界归零
							if (start.rowsIndex >= 0) {
								$("#mouse").offset({
									top: top - totop,
									left: left
								});
								start.rowsIndex--;
								msg.text("Going Up!");
							}
						}
						if (maze[start.rowsIndex - 1][start.colsIndex] === "1") {
							msg.text("You cannot Go Up! Find another way!");
						}
						break;
					case 37:
						//按下向←键
						if (maze[start.rowsIndex][start.colsIndex - 1] === "0") {
							//超出迷宫左界归零
							if (start.colsIndex >= 0) {
								$("#mouse").offset({
									top: top,
									left: left - toleft
								});
								start.colsIndex--;
								msg.text("Going Left!");
							} else {
								start.colsIndex = 0;
							}
						}
						if (maze[start.rowsIndex][start.colsIndex - 1] === "1") {
							msg.text("You cannot Go Left!Find another way!");
						}
						break;
					case 39:
						//按下向→键
						if (maze[start.rowsIndex][start.colsIndex + 1] === "0") {
							//超出迷宫右界归零
							if (start.colsIndex <= maze[0].length - 1) {
								$("#mouse").offset({
									top: top,
									left: left + toleft
								});
								start.colsIndex++;
								msg.text("Going Right!");
							} else {
								start.colsIndex = maze[0].length - 1;
							}
						}
						if (maze[start.rowsIndex][start.colsIndex + 1] === "1") {
							msg.text("You cannot Go Right!Find another way!");
						}
						break;
					case 40:
						//按下向↓键
						if (maze[start.rowsIndex + 1][start.colsIndex] === "0") {
							//超出迷宫下界归零
							if (start.rowsIndex <= row - 1) {
								$("#mouse").offset({
									top: top + totop,
									left: left
								});
								start.rowsIndex++;
								msg.text("Going Down!");
							}
						}
						if (maze[start.rowsIndex + 1][start.colsIndex] === "1") {
							msg.text("You cannot Go down!Find another way!");
						}
						break;
				}
				/*胜利判断，一旦胜利阻止键盘事件*/
				if (start.rowsIndex === endlocation.rowsIndex && start.colsIndex === endlocation.colsIndex) {
					alert("You win!");
					msg.text("You win!");
					progress = false;
				}
			}
			/*求一条路径  参考数据结构迷宫 有BUG*/
			$("#pass").click(function mazePath() {
				var a, b, n = 0,
					count = 0;
				/*先还原迷宫的原本的样子*/
				for (a = 0; a < mazem.length; a++) {
					for (b = 0; b < mazem[a].length; b++) {
						/*还原地图原样*/
						if ($("#mazemap tr:eq(" + a + ")").children("td:eq(" + b + ")").css("background-color") === "rgb(255, 255, 0)") {
							$("#mazemap tr:eq(" + a + ")").children("td:eq(" + b + ")").css("background-color", "white");
						}
						/*还原mazem数组*/
						if (mazem[a][b] === "2") {
							mazem[a][b] = "0"
						}
					}
				}
				var i, j, k, g, h;
				var direction = []; //方向数组
				direction[0] = [1, 0]; //E
				direction[1] = [0, 1]; //S
				direction[2] = [-1, 0]; //W
				direction[3] = [0, -1]; //N
				var test = {}; //建立一个test对象用于记录开始点。而不改变start对象。
				test.rowsIndex = start.rowsIndex;
				test.colsIndex = start.colsIndex;
				test.mark = -1;
				mazem[test.rowsIndex][test.colsIndex] = "2";
				/*定义一个栈用于记录当前位置以及方向，JS栈是通过定义数组的方式*/
				var Arr = [];
				Arr.push(test);
				while (Arr.length !== 0) {
					var element = {};
					element = Arr.pop();
					i = element.colsIndex;
					j = element.rowsIndex;
					k = element.mark + 1;
					while (k <= 3) {
						g = i + direction[k][0];
						h = j + direction[k][1];
						if (g === endlocation.colsIndex && h === endlocation.rowsIndex && mazem[h][g] === "0") {
							var nowPass = [];
							nowPass = deepCopy(Arr);
							while (nowPass.length !== 0) {
								element = nowPass.pop();
								visit(element.rowsIndex, element.colsIndex);
								visit(j, i); /*栈中没有当前点*/
							}
							return;
						}
						if (mazem[h][g] === "0") {
							mazem[h][g] = "2";
							var attend = {};
							attend.colsIndex = i;
							attend.rowsIndex = j;
							attend.mark = k;
							Arr.push(attend);
							i = g;
							j = h;
							k = -1;
						}
						k = k + 1;
					}
				}
			});
			/*走过的路径变黄*/
			function visit(rowIndex, colIndex, num) {
				$("#mazemap tr:eq(" + rowIndex + ")").children("td:eq(" + colIndex + ")").css("background-color", "yellow");
			}
			/*作弊代码*/
			$("#change").click(function Change() {
				/*获取输入框的值，获得的值为字符*/
				var rowsChange = $("#rowChange").val();
				var colsChange = $("#colChange").val();
				var mazemap_row = $("#mazemap tr:eq(" + rowsChange + ")");
				/*越界判断*/
				if (rowsChange > maze.length - 1 || colsChange > maze[0].length - 2) {
					colsChange = ""; //重置输入框
					rowsChange = "";
					$("#rowChange").val(rowsChange);
					$("#colChange").val(colsChange);
					alert("非法数据");
					return;
				}
				/*终点判断*/
				if (rowsChange == endlocation.rowsIndex && colsChange == endlocation.colsIndex) {
					alert("不能改变终点呀童鞋！");
					colsChange = ""; //重置输入框
					rowsChange = "";
					$("#rowChange").val(rowsChange);
					$("#colChange").val(colsChange);
					return;
				}
				/*起点判断*/
				if (rowsChange == start.rowsIndex && colsChange == start.colsIndex) {
					alert("不能改变起点呀童鞋！");
					colsChange = ""; //重置输入框
					rowsChange = "";
					$("#rowChange").val(rowsChange);
					$("#colChange").val(colsChange);
					return;
				}
				/*墙变路，路变墙*/
				if (maze[rowsChange][colsChange] == "1") {
					mazemap_row.children("td:eq(" + colsChange + ")").css("background-color", "white");
					maze[rowsChange][colsChange] = "0"; //maze地图
					mazem[rowsChange][colsChange] = "0"; //为了求路径备份的数组
					mazemap[rowsChange] = replaceChat(mazemap[rowsChange], parseInt(colsChange), "0");
				} else {
					mazemap_row.children("td:eq(" + colsChange + ")").css("background-color", "black");
					maze[rowsChange][colsChange] = "1"; //maze地图
					mazem[rowsChange][colsChange] = "1"; //为了求路径备份的数组
					mazemap[rowsChange] = replaceChat(mazemap[rowsChange], parseInt(colsChange), "1");
				}
			});
		};
	});
	/*数组的深拷贝*/
	function deepCopy(o) {
		var i;
		if (o instanceof Array) {
			var n = [];
			for (i = 0; i < o.length; ++i) {
				n[i] = deepCopy(o[i]);
			}
			return n;

		} else if (o instanceof Object) {
			n = {};
			for (i in o) {
				n[i] = deepCopy(o[i]);
			}
			return n;
		} else {
			return o;
		}
	}
	/*替换一个字符串中某一位置的值*/
	function replaceChat(source, pos, newChar) {
		if (pos < 0 || pos >= source.length || source.length === 0) {
			return "invalid parameters..."
		}
		var iBeginPos = 0;
		/*记录字符串头到要分割的地方，调用字符串substr方法*/
		var sFrontPart = source.substr(iBeginPos, pos);
		/*记录要分割的地方后一个字符到字符串尾，调用字符串substr方法*/
		var sTailPart = source.substr(pos + 1, source.length);
		/*字符串拼接*/
		Result = sFrontPart + newChar + sTailPart;
		return Result;
	}
	/*倒计时*/
	function time(start) {
		var count = $("#time").val();
		var timer = null;

		function print() {
			// 每次添加定时器前，移除前一个定时器
			clearTimeout(timer);
			//函数执行的语句
			count--;
			$("#time").val(count);
			// 添加定时器
			timer = setTimeout(function () {
				print();
			}, 1000);
			// 循环结束条件
			if (count <= 0 || start.rowsIndex === maze.length - 2 && start.colsIndex === maze[0].length - 3) {
				/*胜利*/
				clearTimeout(timer);
			}
			if (count <= 0 && (start.rowsIndex !== maze.length - 2 && start.colsIndex !== maze[0].length - 3)) {
				/*失败*/
				alert("you lose");
				clearTimeout(timer);
			}
		}
		timer = setTimeout(function () {
			print();
		}, 1000);
	}
	/*删除回车符Windows 系统字符分割会留有回车符/r*/
	function deleter(mazem) {
		var i, j;
		for (i = 0; i < mazem.length; i++) {
			for (j = 0; j < mazem[i].length; j++) {
				if (mazem[i][j] === "\r") {
					mazem[i].splice(j, 1);
				}
			}
		}
	}
}());
