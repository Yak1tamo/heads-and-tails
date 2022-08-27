#!/usr/bin/env node

const readline = require('readline')
const { stdin: input, stdout: output } = require('process')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const fs = require('fs')

const file = process.argv[process.argv.length - 1]

yargs(hideBin(process.argv))
	.command('game', 'the game of heads and tails', () => {
		const num = Math.round(Math.random() + 1)
		const rl = readline.createInterface({ input, output })
		rl.question('1 or 2 ==> ', (answer) => {
			const res = answer == num ? 1 : 0
			const writerStr = fs.createWriteStream(file, {
				flags: 'a'
			})
			writerStr.write(`${res} `, 'UTF8')
			rl.close()
		})
	})
	.command('result', 'read the log file', () => {
		const readerStream = fs.createReadStream(file)
		let data = ''
		readerStream
			.setEncoding('UTF8')
			.on('data', (chank) => {
				data += chank
			})
			.on('end', () => {
				const dataArray = data.split(' ')
				dataArray.pop()
				let win = 0
				let logSize = dataArray.length
				dataArray.forEach(el => {
					if (el == 1) win++
				})
				console.log(`Общее число партий: ${logSize}`)
				console.log(`Количество выигранных/проигранных партий: ${win}/${logSize - win}`)
				console.log(`Процентное соотношение выигранных партий: ${Math.round((win / logSize) * 100)}%`)
			})
	})
	.argv
