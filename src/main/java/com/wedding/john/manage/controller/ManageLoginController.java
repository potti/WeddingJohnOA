package com.wedding.john.manage.controller;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.services.LoginService;

@Controller
@SessionAttributes({ "manager" })
public class ManageLoginController {

	private Logger logger = LoggerFactory
			.getLogger(ManageLoginController.class);
	@Autowired
	private LoginService loginService;

	@RequestMapping(method = RequestMethod.GET, value = "/mt")
	public String init(ModelMap modelMap) {
		if (modelMap.containsKey("manager")) {
			return "mtindex";
		}
		return "mtlogin";
	}

	@RequestMapping(method = RequestMethod.GET, value = "/mt/index")
	public String index(@ModelAttribute("manager") User manager,
			ModelMap modelMap) {
		if (manager != null) {
			return "mtindex";
		}
		return "mtlogin";
	}

	@RequestMapping(method = RequestMethod.POST, value = "/mt/login")
	@ResponseBody
	public int login(@RequestBody User user, ModelMap modelMap) {
		if (StringUtils.isEmpty(user.getAccount())) {
			return 0;
		}
		User userInfo = loginService.validate(user.getAccount(), user.getPwd());
		if (userInfo != null && userInfo.getPower() >= 10) {
			modelMap.addAttribute("manager", userInfo);
			logger.info("用户登陆 : " + user.getAccount());
			return 1;
		} else {
			return 0;
		}
	}
}
