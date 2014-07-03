package com.wedding.john.oa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.services.LoginService;

@Controller
public class LoginController {
	@Autowired
	private LoginService loginService;

	@RequestMapping(method = RequestMethod.GET, value = "/login")
	public String login(Model model) {
		return "login";
	}

	@RequestMapping(method = RequestMethod.POST, value = "/login")
	@ResponseBody
	public String login(@RequestBody User user, Model model) {
		if (loginService.validate(user.getUsername(), user.getPwd())) {
			model.addAttribute("success", 1);
			model.addAttribute("name", user.getUsername());
			return "index";
		} else {
			model.addAttribute("success", 0);
			return "login";
		}
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/index")
	public String index(Model model) {
		return "index";
	}
}
