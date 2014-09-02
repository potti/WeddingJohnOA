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
import com.wedding.john.oa.bean.CameraExample.Criteria;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.dao.CameraMapper;
import com.wedding.john.oa.util.Constant;

@Controller
@SessionAttributes({ "user" })
public class CameraController {

	@Autowired
	private CameraMapper cameraMapper;

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
		Criteria aCriteria = example.createCriteria();
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
}
