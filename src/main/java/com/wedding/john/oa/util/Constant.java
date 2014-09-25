package com.wedding.john.oa.util;

public class Constant {

	public static final int DISPLAY_PER_PAGE = 10;

	public static String workPath;

	public static final Integer MAIL_CREATE_ORDER = 1;

	/**
	 * @return the workPath
	 */
	public static String getWorkPath() {
		return workPath;
	}

	/**
	 * @param workPath
	 *            the workPath to set
	 */
	public static void setWorkPath(String workPath) {
		Constant.workPath = workPath;
	}
}
