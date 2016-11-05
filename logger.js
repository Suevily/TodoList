'use strict'

const fs = require('fs')
const pad = require('pad-left')
const path = require('path')
const log4js = require('log4js')

//Check whether the directory has existed, if not, create it
const logsFilePath = path.join(path.resolve('.'), 'logs/server.log')
const logsDir = path.parse(logsFilePath).dir
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir)
}

//Config logger
log4js.configure({
	appenders: [
		{ type: 'console' },
		{ type: 'file', filename: logsFilePath, pattern: '-yyyy-MM-dd' }
	]
})

const logger = log4js.getDefaultLogger()

//A middleware used to storage all the http requests
const loggerMiddleware = async function (ctx, next) {
	const start = new Date()
	await next()
	const ms = new Date() - start

	//Even though I don't know what the hell this is, I just use it
	const remoteAddress = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
		(ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))

	logger.info(`${pad(ctx.method, 6)} ${ctx.status} ${ctx.url} - ${remoteAddress} - ${ms}ms`)
}

module.exports = loggerMiddleware