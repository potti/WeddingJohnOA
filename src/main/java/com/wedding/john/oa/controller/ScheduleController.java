package com.wedding.john.oa.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.wedding.john.oa.bean.Schedule;
import com.wedding.john.oa.bean.ScheduleExample;
import com.wedding.john.oa.bean.User;
import com.wedding.john.oa.dao.ScheduleMapper;

@Controller
@SessionAttributes({ "user" })
public class ScheduleController {

	@Autowired
	private ScheduleMapper scheduleMapper;

	@RequestMapping(method = RequestMethod.GET, value = "/schedule")
	@ResponseBody
	public List<Schedule> getSelfSchedule(@ModelAttribute("user") User user) {
		Calendar aCalendar = Calendar.getInstance();
		Date startdate = aCalendar.getTime();
		aCalendar.add(Calendar.WEEK_OF_YEAR, 2);
		Date enddate = aCalendar.getTime();

		ScheduleExample example = new ScheduleExample();
		example.createCriteria().andCameramanIdEqualTo(user.getId())
				.andEmptyDateBetween(startdate, enddate);
		List<Schedule> list = scheduleMapper.selectByExample(example);
		Map<String, Schedule> map = new HashMap<String, Schedule>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		for (Schedule schedule : list) {
			map.put(sdf.format(schedule.getEmptyDate()), schedule);
		}
		List<Schedule> rtnlist = new ArrayList<Schedule>();
		Calendar bCalendar = Calendar.getInstance();
		for (int i = 0; i < 14; i++) {
			bCalendar.add(Calendar.DAY_OF_YEAR, 1);
			String key = sdf.format(bCalendar.getTime());
			if (map.containsKey(key)) {
				rtnlist.add(map.get(key));
			} else {
				Schedule temp = new Schedule();
				temp.setIsUse(0);
				temp.setBusyDate(bCalendar.getTime());
				rtnlist.add(temp);
			}
		}
		return rtnlist;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/schedule")
	@ResponseBody
	public int updateSelfSchedule(@RequestBody Schedule schedule,
			@ModelAttribute("user") User user) {
		schedule.setIsUse(0);
		schedule.setCameramanId(user.getId());
		if (schedule.getEmptyDate() != null) {
			scheduleMapper.insert(schedule);
		} else if (schedule.getBusyDate() != null) {
			ScheduleExample example = new ScheduleExample();
			example.createCriteria().andCameramanIdEqualTo(user.getId())
					.andIsUseNotEqualTo(1)
					.andEmptyDateEqualTo(schedule.getBusyDate());
			scheduleMapper.deleteByExample(example);
		}
		return 1;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/allSchedule/{yyyyMM}")
	@ResponseBody
	public String getSelfAllSchedules(@PathVariable String yyyyMM,
			@ModelAttribute("user") User user) {
		int year = Integer.parseInt(yyyyMM.substring(0, 4));
		int month = Integer.parseInt(yyyyMM.substring(5, 6));
		Calendar aCalendar = Calendar.getInstance();
		aCalendar.set(Calendar.YEAR, year);
		aCalendar.set(Calendar.MONTH, month - 1);
		aCalendar.set(Calendar.DAY_OF_MONTH, 1);
		Date startDate = aCalendar.getTime();

		Calendar bCalendar = Calendar.getInstance();
		bCalendar.set(Calendar.YEAR, year);
		bCalendar.set(Calendar.MONTH, month - 1);
		bCalendar.set(Calendar.DAY_OF_MONTH, 1);
		bCalendar.add(Calendar.MONTH, 1);
		bCalendar.add(Calendar.DAY_OF_YEAR, -1);
		Date endDate = bCalendar.getTime();

		ScheduleExample example = new ScheduleExample();
		example.createCriteria().andCameramanIdEqualTo(user.getId())
				.andEmptyDateBetween(startDate, endDate);
		List<Schedule> list = scheduleMapper.selectByExample(example);
		if (list.size() > 0) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

			Map<String, Integer> map = new HashMap<String, Integer>();
			for (Schedule schedule : list) {
				map.put(sdf.format(schedule.getEmptyDate()),
						schedule.getIsUse());
			}
			JSONObject json = new JSONObject();
			json.putAll(map);
			return json.toJSONString();
		} else {
			return "{}";
		}

	}
}
