package com.wedding.john.oa.controller.param;

import java.util.Set;

import com.wedding.john.oa.bean.OrderInfo;

public class OrderModel {

	private OrderInfo orderInfo;

	public OrderInfo getOrderInfo() {
		return orderInfo;
	}

	public void setOrderInfo(OrderInfo orderInfo) {
		this.orderInfo = orderInfo;
	}

	private Set<Integer> orderDetail;

	public Set<Integer> getOrderDetail() {
		return orderDetail;
	}

	public void setOrderDetail(Set<Integer> orderDetail) {
		this.orderDetail = orderDetail;
	}

}
