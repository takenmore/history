# PKU computer organization Second
            .data
msg_s:      .asciiz "\r\nSuccess! Location: "
msg_f:      .asciiz "\r\nFail!\r\n"
s_end:      .asciiz "\r\n"
buf:	    .space 100     #最大长度
            .text
main:       la $a0, buf 
            la $a1, 100
            li $v0, 8 # read string
            syscall
inputchar:  li $v0, 12 # read character
            syscall
            addi $t7, $0, 63 # '?'
            sub $t4, $t7, $v0
            beqz $t4, exit
            add $t0, $0, $0
            la $s1, buf
find_loop:  lb $s0, 0($s1)
            sub $t1, $v0, $s0
            beqz $t1, success
            addi $t0, $t0, 1	#条件控制，++
            slt $t3, $t0, $a1	#$a1次循环后进行判断
            beqz $t3, fail
            addi $s1 $s1, 1
            j find_loop
	    #打印成功位置
success:    la $a0, msg_s
            li $v0, 4 # print string
            syscall
            addi $a0, $t0, 1
            li $v0, 1 # print integer
            syscall
            la $a0, s_end
            li $v0, 4
            syscall
            j inputchar
	    #打印失败
fail:       la $a0, msg_f
            li $v0, 4
            syscall
            j inputchar
	    #退出程序
exit:       li $v0, 10
            syscall
