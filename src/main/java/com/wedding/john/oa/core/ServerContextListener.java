package com.wedding.john.oa.core;

import javax.servlet.ServletContextEvent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.ContextLoaderListener;

import com.wedding.john.oa.util.Constant;

public class ServerContextListener extends ContextLoaderListener {
	private static Logger logger = LoggerFactory
			.getLogger(ServerContextListener.class);

	@Override
	public void contextInitialized(ServletContextEvent event) {
		String workPath = event.getServletContext().getRealPath("/") + "/";
		logger.info("Server WorkPath : " + workPath);
		Constant.setWorkPath(workPath);
		super.contextInitialized(event);
		logger.info("****************************************************");
		logger.info("****************************************************");
		logger.info("******     P-OA SYSTEM START SUCCESS    ************");
		logger.info("****************************************************");
		logger.info("****************************************************");

	}

}
