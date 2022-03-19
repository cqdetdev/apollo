import { hex, bold } from 'chalk';

export default class Logger {
	/**
	 * Logger name
	 */
	public readonly name: string;

	private red = hex('#AA0000');
	private brightRed = hex('#FF5555');
	private white = hex('#FFFFFF');
	private magenta = hex('#FF55FF');
	private cyan = hex('#55FFFF');
	private green = hex('#55FF55');


	public constructor(name: string) {
		this.name = name;
	}

	/**
	 * Informative message
	 */
	public info(msg: string) {
		console.log(this.white(bold(`${this.time()} [${this.name}] Info!: ` , msg)));
	};

	/**
	 * Warning message
	 */
	public warn(msg: string) {
		console.log(this.magenta(bold(`${this.time()} [${this.name}] Warning!: ` , msg)));
	};

	/**
	 * Notice message
	 */
	public notice(msg: string) {
		console.log(this.cyan(bold(`${this.time()} [${this.name}] Notice!: ` , msg)));
	};

	/**
	 * Critical Message
	 */
	public critical(msg: string) {
		console.log(this.red(bold(`${this.time()} [${this.name}] Critical!: ` , msg)));
	};

	/**
	 * Debug message
	 */
	public success(msg: string) {
		console.log(this.green(bold(`${this.time()} [${this.name}] Success!: ` , msg)));
	};

	/**
	 * Error message
	 */
	public error(msg: string) {
		console.log(this.brightRed(bold(`${this.time()} [${this.name}] Error!: ` , msg)));
	};

	private time(): string {
		let date: Date = new Date();
		let time: string = [
			date.getHours() >= 10 ? date.getHours() : '0' + date.getHours(),
			date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes(),
			date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
		].join(':');
		return `[${time}]`;
	}
}