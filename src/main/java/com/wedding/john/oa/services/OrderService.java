package com.wedding.john.oa.services;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.wedding.john.oa.bean.Company;
import com.wedding.john.oa.bean.MyOrder;
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
import com.wedding.john.oa.util.Constant;
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
		Set<Integer> contactManSet = null;
		if (!StringUtils.isEmpty(orderModel.getOrderInfo().getContactMan())) {
			String[] contactMans = orderModel.getOrderInfo().getContactMan()
					.split(";");
			contactManSet = new HashSet<Integer>();
			for (String string : contactMans) {
				contactManSet.add(Integer.parseInt(string));
			}
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		for (Integer userId : orderModel.getOrderDetail()) {
			if (userId == null) {
				continue;
			}
			OrderDetail aOrderDetail = new OrderDetail();
			aOrderDetail.setOrderId(orderId);
			aOrderDetail.setCameramanId(userId);
			if (contactManSet != null && contactManSet.contains(userId)) {
				aOrderDetail.setIsContact(0);
			} else {
				aOrderDetail.setIsContact(-1);
			}
			orderDetailMapper.insert(aOrderDetail);
			// send mail
			User user = userMapper.selectByPrimaryKey(userId);
			MailSenderInfo mailInfo = new MailSenderInfo();
			mailInfo.setToAddress(user.getMail());
			mailInfo.setSubject("新的订单");
			FormattingTuple ft = MessageFormatter.arrayFormat(sendMailService
					.getMailContextMap().get(Constant.MAIL_CREATE_ORDER),
					new Object[] {});
			mailInfo.setContent(ft.getMessage());
			sendMailService.sendHtmlMail(mailInfo);

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
					if (temp.length > 2) {
						String[] users = temp[2].split("-");
						for (int i = 0; i < users.length; i++) {
							userSet.add(Integer.parseInt(users[i]));
						}
					}
				}
				if (!userSet.isEmpty()) {
					UserExample aUserExample = new UserExample();
					aUserExample.createCriteria().andIdIn(
							new ArrayList<>(userSet));
					List<User> users = userMapper
							.selectNameByExample(aUserExample);
					for (User user : users) {
						map.put("user-" + user.getId(), user.getName());
					}
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

	/**
	 * 查询未拍订单
	 * 
	 * @param example
	 * @return
	 */
	public List<MyOrder> getMyFutureOrders(Integer userId, Date startDate) {
		return orderInfoMapper.selectMyFutureOrders(userId, startDate);
	}

	/**
	 * 查询历史订单
	 * 
	 * @param example
	 * @return
	 */
	public List<MyOrder> getMyHistoryOrders(Integer userId, Date startDate,
			Date endDate) {
		return orderInfoMapper
				.selectMyHistoryOrders(userId, startDate, endDate);
	}

	/**
	 * 查询自己的订单
	 * 
	 * @param userId
	 * @param orderId
	 * @return
	 */
	public OrderDetail checkIsSelfOrder(Integer userId, Integer orderId) {
		OrderDetailExample aOrderDetailExample = new OrderDetailExample();
		aOrderDetailExample.createCriteria().andOrderIdEqualTo(orderId)
				.andCameramanIdEqualTo(userId);
		List<OrderDetail> list = orderDetailMapper
				.selectByExample(aOrderDetailExample);
		if (list.isEmpty()) {
			return null;
		} else {
			return list.get(0);
		}
	}

	/**
	 * 联系订单
	 * 
	 * @param userId
	 * @param orderId
	 * @return
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public int contactOrder(Integer userId, Integer orderId) {
		OrderDetail od = new OrderDetail();
		od.setIsContact(1);
		OrderDetailExample aOrderDetailExample = new OrderDetailExample();
		aOrderDetailExample.createCriteria().andOrderIdEqualTo(orderId)
				.andCameramanIdEqualTo(userId).andIsContactEqualTo(0);
		int rtn = orderDetailMapper.updateByExampleSelective(od,
				aOrderDetailExample);
		if (rtn == 1) {
			OrderInfo aOrderInfo = orderInfoMapper.selectByPrimaryKey(orderId);
			if (!StringUtils.isEmpty(aOrderInfo.getContactMan())) {
				String[] userIds = aOrderInfo.getContactMan().split(";");
				boolean allContact = true;
				List<Integer> userList = new ArrayList<Integer>();
				for (String uidStr : userIds) {
					int uid = Integer.parseInt(uidStr);
					if (uid != userId) {
						userList.add(uid);
					}
				}
				if (!userList.isEmpty()) {
					aOrderDetailExample.clear();
					aOrderDetailExample.createCriteria()
							.andOrderIdEqualTo(orderId)
							.andCameramanIdIn(userList);
					List<OrderDetail> ods = orderDetailMapper
							.selectByExample(aOrderDetailExample);
					for (OrderDetail orderDetail : ods) {
						if (orderDetail.getIsContact() != 1) {
							allContact = false;
							break;
						}
					}
				}
				if (allContact) {
					aOrderInfo.setStatus(2);// 已全部联系
					orderInfoMapper.updateByPrimaryKeySelective(aOrderInfo);
				}
			}
		}
		return rtn;
	}

	/**
	 * 订单留言
	 * 
	 * @param user
	 * @param orderInfo
	 * @return
	 */
	public int leaveMsgOrder(User user, OrderInfo orderInfo) {
		OrderInfo orderInfo2 = orderInfoMapper.selectByPrimaryKey(orderInfo
				.getId());
		String msg = orderInfo.getRemark() + " by " + user.getName();
		orderInfo2.setRemark(StringUtils.isEmpty(orderInfo2.getRemark()) ? msg
				: orderInfo2.getRemark() + "\n" + msg);
		return orderInfoMapper.updateByPrimaryKey(orderInfo2);
	}

	/**
	 * 逻辑删除订单
	 * 
	 * @param orderId
	 * @return
	 */
	public int delOrder(int orderId) {
		OrderInfo orderInfo = new OrderInfo();
		orderInfo.setId(orderId);
		orderInfo.setStatus(-1);
		return orderInfoMapper.updateByPrimaryKeySelective(orderInfo);
	}
}
