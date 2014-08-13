package com.wedding.john.oa.controller;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.alibaba.fastjson.JSONObject;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.services.LoginService;

@Controller
@SessionAttributes({ "user" })
public class LoginController {

	private Logger logger = LoggerFactory.getLogger(LoginController.class);
	@Autowired
	private LoginService loginService;

	@RequestMapping(method = RequestMethod.GET, value = "/login")
	public String login(Model model) {
		return "login";
	}

	@RequestMapping(method = RequestMethod.POST, value = "/login")
	@ResponseBody
	public int login(@RequestBody User user, ModelMap modelMap) {
		if (StringUtils.isEmpty(user.getAccount())
				|| StringUtils.isEmpty(user.getPwd())) {
			return 0;
		}
		User userInfo = loginService.validate(user.getAccount(), user.getPwd());
		if (userInfo != null) {
			modelMap.addAttribute(userInfo);
			logger.info("用户登陆 : " + user.getAccount());
			return 1;
		} else {
			return 0;
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/index")
	public String index(@ModelAttribute("user") User user) {
		if (user != null) {
			return "index";
		} else {
			return "login";
		}
	}

	@RequestMapping(method = RequestMethod.GET, value = "/isLogin", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String isLogin(@ModelAttribute("user") User user) {
		if (user != null) {
			JSONObject json = new JSONObject();
			json.put("name", user.getName());
			json.put("power", user.getPower());
			return json.toJSONString();
		} else {
			return "";
		}
	}
}
