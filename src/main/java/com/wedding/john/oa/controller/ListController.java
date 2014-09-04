package com.wedding.john.oa.controller;

import java.util.List;

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
import com.wedding.john.oa.bean.Camera;
import com.wedding.john.oa.bean.CameraExample;
import com.wedding.john.oa.bean.Company;
import com.wedding.john.oa.bean.CompanyExample;
import com.wedding.john.oa.bean.Skill;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.dao.CameraMapper;
import com.wedding.john.oa.dao.CompanyMapper;
import com.wedding.john.oa.dao.SkillMapper;
import com.wedding.john.oa.util.Constant;

@Controller
@SessionAttributes({ "user" })
public class ListController {

	@Autowired
	private SkillMapper skillMapper;
	@Autowired
	private CompanyMapper companyMapper;
	@Autowired
	private CameraMapper cameraMapper;

	// ************** Camera ********************************************

	@RequestMapping(method = RequestMethod.GET, value = "/cameras")
	@ResponseBody
	public List<Camera> getCameras() {
		List<Camera> list = cameraMapper.selectByExample(null);
		return list;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/cameras", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getCamerasByCondition(@RequestBody Camera camera) {
		CameraExample example = new CameraExample();
		com.wedding.john.oa.bean.CameraExample.Criteria aCriteria = example
				.createCriteria();
		if (!StringUtils.isEmpty(camera.getName())) {
			aCriteria.andNameLike("%" + camera.getName() + "%");
		}
		List<Camera> list = cameraMapper.selectByExample(example);
		JSONObject json = new JSONObject();
		json.put("datas", list);
		json.put("pages",
				list.size() % Constant.DISPLAY_PER_PAGE > 0 ? list.size()
						/ Constant.DISPLAY_PER_PAGE + 1 : list.size()
						/ Constant.DISPLAY_PER_PAGE);
		return json.toJSONString();
	}

	@RequestMapping(method = RequestMethod.POST, value = "/camera")
	@ResponseBody
	public int createCamera(@RequestBody Camera camera,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		cameraMapper.insertSelective(camera);
		return camera.getId();
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/camera")
	@ResponseBody
	public int updateCamera(@RequestBody Camera camera,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		return cameraMapper.updateByPrimaryKeySelective(camera);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/camera/{id}", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public Camera getCameraById(@PathVariable Integer id,
			@ModelAttribute("user") User user) {
		return cameraMapper.selectByPrimaryKey(id);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/camera/{id}")
	@ResponseBody
	public int deleteCameraById(@PathVariable Integer id,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		return cameraMapper.deleteByPrimaryKey(id);
	}

	// ************** Skill ********************************************

	@RequestMapping(method = RequestMethod.GET, value = "/skill/{skillId}", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public Skill getSkillById(@PathVariable Integer skillId) {
		return skillMapper.selectByPrimaryKey(skillId);
	}

	@RequestMapping(method = RequestMethod.GET, value = "/skill")
	@ResponseBody
	public List<Skill> getSkills() {
		List<Skill> list = skillMapper.selectByExample(null);
		return list;
	}

	// ************** company ********************************************

	@RequestMapping(method = RequestMethod.GET, value = "/company")
	@ResponseBody
	public List<Company> getCompanys() {
		List<Company> list = companyMapper.selectByExample(null);
		return list;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/company")
	@ResponseBody
	public int createCompany(@RequestBody Company company,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		companyMapper.insertSelective(company);
		return company.getId();
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/company")
	@ResponseBody
	public int updateCompany(@RequestBody Company company,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		return companyMapper.updateByPrimaryKeySelective(company);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/companys", produces = "text/plain;charset=UTF-8")
	@ResponseBody
	public String getCompanyByCondition(@RequestBody Company company) {
		CompanyExample example = new CompanyExample();
		com.wedding.john.oa.bean.CompanyExample.Criteria aCriteria = example
				.createCriteria();
		if (!StringUtils.isEmpty(company.getCompanyName())) {
			aCriteria.andCompanyNameLike("%" + company.getCompanyName() + "%");
		}
		if (!StringUtils.isEmpty(company.getNo())) {
			aCriteria.andNoLike("%" + company.getNo() + "%");
		}
		if (company.getType() != null) {
			aCriteria.andTypeEqualTo(company.getType());
		}
		if (company.getLevel() != null) {
			aCriteria.andLevelEqualTo(company.getLevel());
		}
		List<Company> list = companyMapper.selectByExample(example);
		JSONObject json = new JSONObject();
		json.put("datas", list);
		json.put("pages",
				list.size() % Constant.DISPLAY_PER_PAGE > 0 ? list.size()
						/ Constant.DISPLAY_PER_PAGE + 1 : list.size()
						/ Constant.DISPLAY_PER_PAGE);
		return json.toJSONString();
	}

	@RequestMapping(method = RequestMethod.GET, value = "/company/{id}", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public Company getCompanyById(@PathVariable Integer id) {
		return companyMapper.selectByPrimaryKey(id);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/company/{id}")
	@ResponseBody
	public int deleteCompanyById(@PathVariable Integer id,
			@ModelAttribute("user") User user) {
		if (user.getPower() < 10) {
			return -1;
		}
		return companyMapper.deleteByPrimaryKey(id);
	}
}
