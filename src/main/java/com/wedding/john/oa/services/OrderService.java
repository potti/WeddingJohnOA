package com.wedding.john.oa.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.wedding.john.oa.bean.Company;
import com.wedding.john.oa.bean.OrderDetail;
import com.wedding.john.oa.bean.OrderDetailExample;
import com.wedding.john.oa.bean.OrderInfo;
import com.wedding.john.oa.bean.OrderInfoExample;
import com.wedding.john.oa.bean.Schedule;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.bean.UserExample;
import com.wedding.john.oa.controller.param.OrderModel;
import com.wedding.john.oa.dao.CompanyMapper;
import com.wedding.john.oa.dao.OrderDetailMapper;
import com.wedding.john.oa.dao.OrderInfoMapper;
import com.wedding.john.oa.dao.ScheduleMapper;
import com.wedding.john.oa.dao.UserMapper;
import com.wedding.john.oa.util.MailSenderInfo;

@Service
public class OrderService {

	private Integer ONE_DAY_MS = 86400000;

	@Autowired
	private OrderInfoMapper orderInfoMapper;
	@Autowired
	private OrderDetailMapper orderDetailMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private CompanyMapper companyMapper;
	@Autowired
	private SendMailService sendMailService;

	/**
	 * insert order
	 * 
	 * @param orderModel
	 * @return
	 * @throws Exception
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public int insertOrder(OrderModel orderModel) {
		orderInfoMapper.insertSelective(orderModel.getOrderInfo());
		int orderId = orderModel.getOrderInfo().getId();
		insertOrderDetail(orderModel, orderId);
		return orderId;
	}

	/**
	 * insert order detail and schedule
	 * 
	 * @param orderModel
	 * @param orderId
	 */
	private void insertOrderDetail(OrderModel orderModel, int orderId) {
		int days = (int) (orderModel.getOrderInfo().getEndDate().getTime() - orderModel
				.getOrderInfo().getStartDate().getTime())
				/ ONE_DAY_MS;
		for (Integer userId : orderModel.getOrderDetail()) {
			OrderDetail aOrderDetail = new OrderDetail();
			aOrderDetail.setOrderId(orderId);
			aOrderDetail.setCameramanId(userId);
			orderDetailMapper.insert(aOrderDetail);
			// send mail
			User user = userMapper.selectByPrimaryKey(userId);
			MailSenderInfo mailInfo = new MailSenderInfo();
			mailInfo.setToAddress(user.getMail());
			mailInfo.setSubject("Test from Wedding OA System");
			mailInfo.setContent("你有一个订单 时间是:"
					+ orderModel.getOrderInfo().getStartDate().toString());
			sendMailService.sendTextMail(mailInfo);
			
			for (int i = 0; i < days + 1; i++) {
				long time = orderModel.getOrderInfo().getStartDate().getTime()
						+ i * ONE_DAY_MS;
				Schedule aSchedule = new Schedule();
				aSchedule.setEmptyDate(new Date(time));
				aSchedule.setIsUse(1);
				aSchedule.setCameramanId(userId);
				int rows = scheduleMapper
						.updateByPrimaryKeySelective(aSchedule);
				if (rows == 0) {
					scheduleMapper.insert(aSchedule);
				}
			}
		}
	}

	/**
	 * 查询订单
	 * 
	 * @param example
	 * @return
	 */
	public List<OrderInfo> getOrdersByCondition(OrderInfoExample example) {
		return orderInfoMapper.selectByExample(example);
	}

	/**
	 * 取得单个订单
	 * 
	 * @param orderId
	 * @return
	 */
	public Map<String, Object> getOrderInfoById(Integer orderId) {
		Map<String, Object> map = null;
		OrderInfo orderInfo = orderInfoMapper.selectByPrimaryKey(orderId);
		if (orderInfo != null) {
			map = new HashMap<String, Object>();
			map.put("orderInfo", orderInfo);
			Company aCompany = companyMapper.selectByPrimaryKey(orderInfo
					.getCompanyId());
			map.put("companyName", aCompany.getCompanyName());
			if (!StringUtils.isEmpty(orderInfo.getNeedman())) {
				String[] types = orderInfo.getNeedman().split(";");
				Set<Integer> userSet = new HashSet<Integer>();
				for (String type : types) {
					String[] temp = type.split(":");
					String[] users = temp[1].split("-");
					for (int i = 0; i < users.length; i++) {
						userSet.add(Integer.parseInt(users[i]));
					}
				}
				UserExample aUserExample = new UserExample();
				aUserExample.createCriteria().andIdIn(new ArrayList<>(userSet));
				List<User> users = userMapper.selectNameByExample(aUserExample);
				for (User user : users) {
					map.put("user-" + user.getId(), user.getName());
				}
			}
		}
		return map;
	}

	/**
	 * 更新订单
	 * 
	 * @param orderModel
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public int updateOrder(OrderModel orderModel) {
		int rows = orderInfoMapper.updateByPrimaryKeySelective(orderModel
				.getOrderInfo());
		if (rows == 1) {
			int orderId = orderModel.getOrderInfo().getId();
			OrderDetailExample aOrderDetailExample = new OrderDetailExample();
			aOrderDetailExample.createCriteria().andOrderIdEqualTo(orderId);
			orderDetailMapper.deleteByExample(aOrderDetailExample);
			insertOrderDetail(orderModel, orderId);
		}
		return rows;
	}
}
