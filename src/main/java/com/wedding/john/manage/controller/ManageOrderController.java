package com.wedding.john.manage.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.alibaba.fastjson.JSONObject;
import com.wedding.john.oa.bean.OrderInfo;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.services.OrderService;

@Controller
@SessionAttributes({ "manager" })
public class ManageOrderController {

	@Autowired
	private OrderService orderService;

	/**
	 * 管理员查询订单
	 * 
	 * @param orderId
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/mt/orders", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getOrderById(@ModelAttribute("manager") User manager) {
		if (manager.getPower() < 10) {
			return null;
		}
		List<OrderInfo> list = orderService.getOrdersByCondition(null);
		JSONObject json = new JSONObject();
		json.put("draw", 1);
		json.put("recordsTotal", list.size());
		json.put("recordsFiltered", list.size());
		json.put("data", list);
		return json.toJSONString();
	}

}
