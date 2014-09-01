package com.wedding.john.oa.controller;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.controller.param.ChangePwdModel;
import com.wedding.john.oa.dao.ScheduleMapper;
import com.wedding.john.oa.dao.UserMapper;
import com.wedding.john.oa.util.CommonUtils;

@Controller
@SessionAttributes({ "user" })
public class UserController {
	@Autowired
	private UserMapper userMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;

	@RequestMapping(method = RequestMethod.GET, value = "/userAvailable/{startDate}/{endDate}")
	@ResponseBody
	public List<User> getAvailableUser(
			@PathVariable @DateTimeFormat(iso = ISO.DATE) Date startDate,
			@PathVariable @DateTimeFormat(iso = ISO.DATE) Date endDate) {
		return userMapper.selectAvailableUser(startDate, endDate);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/changePwd")
	@ResponseBody
	public Integer changeUserPwd(@RequestBody ChangePwdModel changePwdModel,
			@ModelAttribute("user") User user) {
		if (!changePwdModel.getNewPwd().equals(changePwdModel.getRepeadPwd())) {
			return -1;
		}
		if (StringUtils.isEmpty(user.getPwd())
				&& !StringUtils.isEmpty(changePwdModel.getOldPwd())) {
			return -1;
		}

		if (!StringUtils.isEmpty(user.getPwd())
				&& !user.getPwd().equals(
						CommonUtils.getMD5(changePwdModel.getOldPwd()
								.getBytes()))) {
			return -1;
		}

		String newPwdMd5 = CommonUtils.getMD5(changePwdModel.getNewPwd()
				.getBytes());
		User aUser = new User();
		aUser.setId(user.getId());
		aUser.setPwd(newPwdMd5);
		int rtn = userMapper.updateByPrimaryKeySelective(aUser);
		if (rtn == 1) {
			user.setPwd(newPwdMd5);
		}
		return rtn;
	}

	/**
	 * 创建用户
	 * 
	 * @param newUser
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST, value = "/user")
	@ResponseBody
	public int createUser(@RequestBody User newUser,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		newUser.setDel(0);
		newUser.setCreateDate(new Date());
		userMapper.insertSelective(newUser);
		return newUser.getId();
	}

	/**
	 * 修改用户
	 * 
	 * @param oldUser
	 * @param user
	 * @return
	 */
	@RequestMapping(method = RequestMethod.PUT, value = "/user")
	@ResponseBody
	public int updateUser(@RequestBody User oldUser,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		int rtn = userMapper.updateByPrimaryKeySelective(oldUser);
		return rtn;
	}
}
