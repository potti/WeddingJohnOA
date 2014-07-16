package com.wedding.john.oa.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.dao.ScheduleMapper;
import com.wedding.john.oa.dao.UserMapper;

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
}
