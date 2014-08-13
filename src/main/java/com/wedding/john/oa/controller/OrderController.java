package com.wedding.john.oa.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.alibaba.fastjson.JSONObject;
import com.wedding.john.oa.bean.OrderInfo;
import com.wedding.john.oa.bean.OrderInfoExample;
import com.wedding.john.oa.bean.OrderInfoExample.Criteria;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.controller.param.OrderModel;
import com.wedding.john.oa.services.OrderService;

@Controller
@SessionAttributes({ "user" })
public class OrderController {

	@Autowired
	private OrderService orderService;

	@RequestMapping(method = RequestMethod.POST, value = "/order")
	@ResponseBody
	public int createOrder(@RequestBody OrderModel orderModel,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		orderModel.getOrderInfo().setCreateUser(user.getId());
		orderModel.getOrderInfo().setCreateTime(new Date());
		int orderId = orderService.insertOrder(orderModel);
		return orderId;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/order")
	@ResponseBody
	public int updateOrder(@RequestBody OrderModel orderModel,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		orderModel.getOrderInfo().setModifyUser(user.getId());
		orderModel.getOrderInfo().setModifyTime(new Date());
		int rtn = orderService.updateOrder(orderModel);
		return rtn;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/getOrders")
	@ResponseBody
	public String getOrdersByCondition(@RequestBody OrderInfo orderInfo,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return "{}";
		}
		OrderInfoExample aOrderInfoExample = new OrderInfoExample();
		Criteria aCriteria = aOrderInfoExample.createCriteria();
		if (orderInfo.getStartDate() != null) {
			aCriteria
					.andStartDateGreaterThanOrEqualTo(orderInfo.getStartDate());
		}
		if (orderInfo.getEndDate() != null) {
			aCriteria.andEndDateLessThanOrEqualTo(orderInfo.getEndDate());
		}
		if (orderInfo.getCompanyId() != null) {
			aCriteria.andCompanyIdEqualTo(orderInfo.getCompanyId());
		}
		if (!StringUtils.isEmpty(orderInfo.getOrderNo())) {
			aCriteria.andOrderNoLike("%" + orderInfo.getOrderNo() + "%");
		}
		List<OrderInfo> list = orderService
				.getOrdersByCondition(aOrderInfoExample);
		JSONObject json = new JSONObject();
		json.put("datas", list);
		json.put("pages",
				list.size() % 2 > 0 ? list.size() / 2 + 1 : list.size() / 2);
		return json.toJSONString();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/order/{orderId}", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String createOrder(@PathVariable Integer orderId,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return null;
		}
		Map<String, Object> map = orderService.getOrderInfoById(orderId);
		JSONObject json = new JSONObject();
		json.putAll(map);
		return json.toJSONString();
	}
}
