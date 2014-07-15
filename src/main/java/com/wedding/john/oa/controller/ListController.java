package com.wedding.john.oa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.wedding.john.oa.bean.Company;
import com.wedding.john.oa.bean.Skill;
import com.wedding.john.oa.bean.SkillExample;
import com.wedding.john.oa.dao.CompanyMapper;
import com.wedding.john.oa.dao.SkillMapper;

@Controller
@SessionAttributes({ "user" })
public class ListController {

	@Autowired
	private SkillMapper skillMapper;
	@Autowired
	private CompanyMapper companyMapper;

	@RequestMapping(method = RequestMethod.GET, value = "/skill/{skillId}")
	@ResponseBody
	public List<Skill> getSkillById(@PathVariable Integer skillId) {
		SkillExample aSkillExample = new SkillExample();
		aSkillExample.createCriteria().andIdEqualTo(skillId);
		List<Skill> list = skillMapper.selectByExample(aSkillExample);
		return list;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/skill")
	@ResponseBody
	public List<Skill> getSkills() {
		List<Skill> list = skillMapper.selectByExample(null);
		return list;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/company")
	@ResponseBody
	public List<Company> getCompanys() {
		List<Company> list = companyMapper.selectByExample(null);
		return list;
	}
}
