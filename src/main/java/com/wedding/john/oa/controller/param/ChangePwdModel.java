package com.wedding.john.oa.controller.param;

public class ChangePwdModel {

	private String oldPwd;
	private String newPwd;
	private String repeadPwd;

	/**
	 * @return the oldPwd
	 */
	public String getOldPwd() {
		return oldPwd;
	}

	/**
	 * @param oldPwd
	 *            the oldPwd to set
	 */
	public void setOldPwd(String oldPwd) {
		this.oldPwd = oldPwd;
	}

	/**
	 * @return the newPwd
	 */
	public String getNewPwd() {
		return newPwd;
	}

	/**
	 * @param newPwd
	 *            the newPwd to set
	 */
	public void setNewPwd(String newPwd) {
		this.newPwd = newPwd;
	}

	/**
	 * @return the repeadPwd
	 */
	public String getRepeadPwd() {
		return repeadPwd;
	}

	/**
	 * @param repeadPwd
	 *            the repeadPwd to set
	 */
	public void setRepeadPwd(String repeadPwd) {
		this.repeadPwd = repeadPwd;
	}
}
