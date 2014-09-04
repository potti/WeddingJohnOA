package com.wedding.john.oa.controller;

import java.util.Calendar;
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
import com.wedding.john.oa.bean.MyOrder;
import com.wedding.john.oa.bean.OrderDetail;
import com.wedding.john.oa.bean.OrderInfo;
import com.wedding.john.oa.bean.OrderInfoExample;
import com.wedding.john.oa.bean.OrderInfoExample.Criteria;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.controller.param.OrderModel;
import com.wedding.john.oa.services.OrderService;
import com.wedding.john.oa.util.Constant;

@Controller
@SessionAttributes({ "user" })
public class OrderController {

	@Autowired
	private OrderService orderService;

	/**
	 * 创建订单
	 * 
	 * @param orderModel
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/order")
	@ResponseBody
	public int createOrder(@RequestBody OrderModel orderModel,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		if (orderModel.getOrderInfo().getStartDate() != null
				&& !StringUtils.isEmpty(orderModel.getOrderInfo().getNeedman())) {
			orderModel.getOrderInfo().setStatus(1);
		} else {
			orderModel.getOrderInfo().setStatus(0);
		}
		orderModel.getOrderInfo().setCreateUser(user.getId());
		orderModel.getOrderInfo().setCreateTime(new Date());
		int orderId = orderService.insertOrder(orderModel);
		return orderId;
	}

	/**
	 * 更新订单
	 * 
	 * @param orderModel
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.PUT, value = "/order")
	@ResponseBody
	public int updateOrder(@RequestBody OrderModel orderModel,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		orderModel.getOrderInfo().setModifyUser(user.getId());
		orderModel.getOrderInfo().setModifyTime(new Date());
		if (orderModel.getOrderInfo().getStartDate() != null
				&& !StringUtils.isEmpty(orderModel.getOrderInfo().getNeedman())) {
			orderModel.getOrderInfo().setStatus(1);
		}
		int rtn = orderService.updateOrder(orderModel);
		return rtn;
	}

	/**
	 * 查询订单
	 * 
	 * @param orderInfo
	 * @param user
	 * @return
	 */
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
		if (orderInfo.getStatus() != null) {
			aCriteria.andStatusEqualTo(orderInfo.getStatus());
		} else {
			aCriteria.andStatusGreaterThan(-1);
		}
		List<OrderInfo> list = orderService
				.getOrdersByCondition(aOrderInfoExample);
		JSONObject json = new JSONObject();
		json.put("datas", list);
		json.put("pages",
				list.size() % Constant.DISPLAY_PER_PAGE > 0 ? list.size()
						/ Constant.DISPLAY_PER_PAGE + 1 : list.size()
						/ Constant.DISPLAY_PER_PAGE);
		return json.toJSONString();
	}

	/**
	 * 管理员查询订单
	 * 
	 * @param orderId
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/order/{orderId}", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getOrderById(@PathVariable Integer orderId,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return null;
		}
		Map<String, Object> map = orderService.getOrderInfoById(orderId);
		JSONObject json = new JSONObject();
		json.putAll(map);
		return json.toJSONString();
	}

	/**
	 * 查询未拍订单
	 * 
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/myFOrders", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getMyFutureOrders(@ModelAttribute("user") User user) {
		List<MyOrder> list = orderService.getMyFutureOrders(user.getId(),
				new Date());
		JSONObject json = new JSONObject();
		json.put("datas", list);
		json.put("pages",
				list.size() % Constant.DISPLAY_PER_PAGE > 0 ? list.size()
						/ Constant.DISPLAY_PER_PAGE + 1 : list.size()
						/ Constant.DISPLAY_PER_PAGE);
		return json.toJSONString();
	}

	/**
	 * 查询历史订单
	 * 
	 * @param startDate
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/myHOrders", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getMyHistoryOrders(@ModelAttribute("user") User user) {
		Calendar aCalendar = Calendar.getInstance();
		aCalendar.add(Calendar.DAY_OF_YEAR, -7);
		List<MyOrder> list = orderService.getMyHistoryOrders(user.getId(),
				aCalendar.getTime(), new Date());
		JSONObject json = new JSONObject();
		json.put("datas", list);
		json.put("pages",
				list.size() % Constant.DISPLAY_PER_PAGE > 0 ? list.size()
						/ Constant.DISPLAY_PER_PAGE + 1 : list.size()
						/ Constant.DISPLAY_PER_PAGE);
		return json.toJSONString();
	}

	/**
	 * 自己的订单查询
	 * 
	 * @param orderId
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/myOrder/{orderId}", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getMyOrderById(@PathVariable Integer orderId,
			@ModelAttribute("user") User user) {
		OrderDetail aOrderDetail = orderService.checkIsSelfOrder(user.getId(),
				orderId);
		if (aOrderDetail == null) {
			return "";
		}
		Map<String, Object> map = orderService.getOrderInfoById(orderId);
		map.put("isContact", aOrderDetail.getIsContact());
		JSONObject json = new JSONObject();
		json.putAll(map);
		return json.toJSONString();
	}

	/**
	 * 联系订单
	 * 
	 * @param orderId
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.PUT, value = "/contact/{orderId}")
	@ResponseBody
	public int contactOrder(@PathVariable Integer orderId,
			@ModelAttribute("user") User user) {
		OrderDetail aOrderDetail = orderService.checkIsSelfOrder(user.getId(),
				orderId);
		if (aOrderDetail == null || aOrderDetail.getIsContact() != 0) {
			return -1;
		}
		int rtn = orderService.contactOrder(user.getId(), orderId);
		return rtn;
	}

	/**
	 * 订单留言
	 * 
	 * @param orderId
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.PUT, value = "/msgOrder")
	@ResponseBody
	public int messageOrder(@RequestBody OrderInfo orderInfo,
			@ModelAttribute("user") User user) {
		int rtn = orderService.leaveMsgOrder(user, orderInfo);
		return rtn;
	}

	/**
	 * 删除订单
	 * 
	 * @param id
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.DELETE, value = "/order/{id}")
	@ResponseBody
	public int deleteOrderById(@PathVariable Integer id,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		return orderService.delOrder(id);
	}
}
