# PKU computer organization First
 .data
 #定义大写对应字符数组
u_alphabet:  .asciiz 
 	    "Alpha ","Bravo ","China ","Delta ","Echo ","Foxtrot ",
           "Golf ","Hotel ","India ","Juliet ","Kilo ","Lima ",
           "Mary ","November ","Oscar ","Paper ","Quebec ","Research ",
           "Sierra ","Tango ","Uniform ","Victor ","Whisky ","X-ray ",
           "Yankee ","Zulu "
 #定义小写对应字符数组
 l_alphabet:  .asciiz
 	    "alpha ","bravo ","china ","delta ","echo ","foxtrot ",
           "golf ","hotel ","india ","juliet ","kilo ","lima ",
           "mary ","november ","oscar ","paper ","quebec ","research ",
           "sierra ","tango ","uniform ","victor ","whisky ","x-ray ",
           "yankee ","zulu "
  #定义字符数组的偏移量
alphabet_offset:  .word
            0,7,14,21,28,34,43,49,56,63,71,
            77,83,89,99,106,113,121,131,
            139,146,155,163,171,178,186
  #定义数字对应字符数组
number: .asciiz
	"zero","First","Second","Third","Fourth","Fifth","Sixth","Seventh",
	"Eighth","Ninth"
   #定义数字对应字符数组的偏移量
number_offset:  .word
	     0,5,11,18,24,31,37,43,51,58,64
	.text
	.globl main
main:    
	li $v0, 12 # read character
        syscall
        sub $t1,$v0,63 #"输入为?"
        beqz $t1,exit
	sub $t1,$v0,48 		#"0"
	slt $s1,$t1,$0		#比'0'小的额外情况
	bnez $s1,others
	# 数字判断
	sub $t2,$t1,10
	slt $s2,$t2,$0
	bnez $s2,turnNum
	#大写判断
	sub $t2,$v0,91
	slt $s2,$t2,$0
	sub $t3,$v0,64
	sgt $s3,$t3,$0
	and $s0,$s2,$s3
	bnez $s0,turnCap
	#小写判断
	sub $t2,$v0,123
	slt $s2,$t2,$0		
	sub $t3,$v0,96
	sgt $s3,$t3,$0
	and $s0,$s2,$s3
	bnez $s0,turnLow
	j others
	
turnNum:    add $t2, $t2, 10
            sll $t2, $t2, 2
            la $s0, number_offset
            add $s0, $s0, $t2
            lw $s1, ($s0)
            la $a0, number
            add $a0, $a0, $s1
            li $v0, 4
            syscall
	    j main
turnCap:	    sub $t3,$t3,1
	    sll $t3,$t3,2
	    la $s0,alphabet_offset
	    add $s0,$s0,$t3
	    lw $s1,($s0)
	    la $a0,u_alphabet
	    add $a0,$a0,$s1
	    li $v0,4
	    syscall
	    j main
turnLow:    sub $t3,$t3,1
	    sll $t3,$t3,2
	    la $s0,alphabet_offset
	    add $s0,$s0,$t3
	    lw $s1,($s0)
	    la $a0,l_alphabet
	    add $a0,$a0,$s1
	    li $v0,4
	    syscall
	    j main

others:     and $a0, $0, $0
            add $a0, $a0, 42 # '*'
            li $v0, 11 # print character
            syscall
            j main
exit:	li $v0, 10 # exit
     	syscall
