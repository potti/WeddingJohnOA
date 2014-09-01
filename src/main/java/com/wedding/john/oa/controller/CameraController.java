package com.wedding.john.oa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.wedding.john.oa.bean.Camera;
import com.wedding.john.oa.dao.CameraMapper;

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
}
