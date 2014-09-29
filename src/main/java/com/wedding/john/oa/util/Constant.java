package com.wedding.john.oa.util;

import java.util.HashMap;
import java.util.Map;

public class Constant {

	public static final int DISPLAY_PER_PAGE = 10;

	public static String workPath;

	public static final String PAY_TYPE_1 = "现结";
	public static final String PAY_TYPE_2 = "总结";

	public static final String DATE_FMT_YYYY_MM_DD_E = "yyyy-MM-dd E";
	public static final String DATE_FMT_YYYY_MM_DD_HH_SS_CHN = "yy年MM月dd号HH点mm分";

	public static final String LEAVE_MAG = "{}于{}写道: ";

	public static final Map<Integer, String> SKILL_MAP = new HashMap<Integer, String>();
	public static final Map<Integer, String> CAMERA_MAP = new HashMap<Integer, String>();

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
