package com.wedding.john.oa.services;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.bean.UserExample;
import com.wedding.john.oa.bean.UserExample.Criteria;
import com.wedding.john.oa.dao.UserMapper;
import com.wedding.john.oa.util.CommonUtils;

@Service
public class LoginService {
	@Autowired
	private UserMapper userMapper;

	public User validate(String name, String pwd) {
		UserExample example = new UserExample();
		Criteria aCriteria = example.createCriteria();
		aCriteria.andAccountEqualTo(name);
		if (StringUtils.isEmpty(pwd)) {
			aCriteria.andPwdIsNull();
		} else {
			aCriteria.andPwdEqualTo(CommonUtils.getMD5(pwd.getBytes()));
		}
		List<User> users = userMapper.selectByExample(example);
		if (!users.isEmpty()) {
			return users.get(0);
		} else {
			return null;
		}
	}
}
