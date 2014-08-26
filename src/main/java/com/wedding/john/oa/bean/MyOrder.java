package com.wedding.john.oa.bean;

import java.util.Date;

public class MyOrder {

	private int orderId;
	private String companyName;
	private Date startDate;
	private int isContact;

	/**
	 * @return the orderId
	 */
	public int getOrderId() {
		return orderId;
	}

	/**
	 * @param orderId
	 *            the orderId to set
	 */
	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}

	/**
	 * @return the companyName
	 */
	public String getCompanyName() {
		return companyName;
	}

	/**
	 * @param companyName
	 *            the companyName to set
	 */
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	/**
	 * @return the startDate
	 */
	public Date getStartDate() {
		return startDate;
	}

	/**
	 * @param startDate
	 *            the startDate to set
	 */
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	/**
	 * @return the isContact
	 */
	public int getIsContact() {
		return isContact;
	}

	/**
	 * @param isContact
	 *            the isContact to set
	 */
	public void setIsContact(int isContact) {
		this.isContact = isContact;
	}

}
