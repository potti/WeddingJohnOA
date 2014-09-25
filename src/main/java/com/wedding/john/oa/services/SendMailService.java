package com.wedding.john.oa.services;

import java.io.File;
import java.io.FileInputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.lang.math.RandomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wedding.john.oa.util.Constant;
import com.wedding.john.oa.util.MailAuthenticator;
import com.wedding.john.oa.util.MailSenderInfo;

public class SendMailService {

	private Logger logger = LoggerFactory.getLogger(SendMailService.class);
	/**
	 * 发送邮件的服务器的IP
	 */
	private String mailServerHost;
	/**
	 * 发送邮件的服务器的端口
	 */
	private String mailServerPort = "25";
	/**
	 * 是否需要身份验证
	 */
	private boolean validate = true;
	/**
	 * 登陆邮件发送服务器的用户名
	 */
	private String userName;
	/**
	 * 登陆邮件发送服务器的密码
	 */
	private String password;
	/**
	 * 邮件发送者的地址
	 */
	private String fromAddress;

	/**
	 * 邮箱参数
	 */
	private Properties mailProperties;
	/**
	 * 邮箱认证
	 */
	private MailAuthenticator authenticator = null;

	/**
	 * 邮件内容Map
	 */
	private Map<Integer, String> mailContextMap = new HashMap<Integer, String>();

	/**
	 * 线程数
	 */
	private Integer sendThreadNum;

	/**
	 * 线程发送间隔(秒)
	 */
	private Integer sendTimeInterval;

	/**
	 * 写入数据线程队列
	 */
	private Map<Integer, BlockingQueue<MailSenderInfo>> writeQueue;

	/**
	 * 读取数据线程队列
	 */
	private Map<Integer, BlockingQueue<MailSenderInfo>> readQueue;

	/**
	 * 写入锁
	 */
	private final ReentrantLock writeLock = new ReentrantLock();

	/**
	 * 写入条件
	 */
	private final Condition canWrite = writeLock.newCondition();

	/**
	 * 是否正在读取数据
	 */
	private volatile boolean isRead = false;

	/**
	 * 获得邮件会话属性
	 */
	public void init() {
		mailProperties = new Properties();
		mailProperties.put("mail.smtp.host", this.mailServerHost);
		mailProperties.put("mail.smtp.port", this.mailServerPort);
		mailProperties.put("mail.smtp.auth", validate ? "true" : "false");

		Properties p = new Properties();
		try {
			p.load(new FileInputStream(new File(Constant.getWorkPath()
					+ "WEB-INF/conf/mailContext.properties")));
			Iterator<Map.Entry<Object, Object>> itr = p.entrySet().iterator();
			while (itr.hasNext()) {
				Map.Entry<Object, Object> e = itr.next();
				mailContextMap.put(
						Integer.parseInt((String) e.getKey()),
						new String(((String) e.getValue())
								.getBytes("ISO-8859-1"), "utf-8"));
			}
		} catch (Exception e) {
			throw new RuntimeException("MAIL CONTEXT LOAD ERROR!!");
		}

		if (this.isValidate()) {
			// 如果需要身份认证，则创建一个密码验证器
			authenticator = new MailAuthenticator(this.getUserName(),
					this.getPassword());
		}

		initWriteQueue();

		Thread sendTaskThread = new Thread(new SendMailTask(),
				"Send Mail Thread Task");
		sendTaskThread.setDaemon(true);
		sendTaskThread.start();

	}

	private void initWriteQueue() {
		writeQueue = new HashMap<Integer, BlockingQueue<MailSenderInfo>>();
		for (int i = 0; i < sendThreadNum; i++) {
			writeQueue.put(i, new LinkedBlockingQueue<MailSenderInfo>());
		}
	}

	/**
	 * 以HTML格式发送邮件
	 * 
	 * @param mailInfo
	 */
	public void sendHtmlMail(MailSenderInfo mailInfo) {
		if (isRead) {
			try {
				canWrite.await();
			} catch (InterruptedException e) {
				logger.error("sendHtmlMail write in queue error!!");
				return;
			}
		}
		writeQueue.get(RandomUtils.nextInt(sendThreadNum)).add(mailInfo);
	}

	private boolean doSendHtmlMail(MailSenderInfo mailInfo) {
		try {
			// 根据邮件会话属性和密码验证器构造一个发送邮件的session
			Session sendMailSession = Session.getDefaultInstance(
					mailProperties, authenticator);
			// 根据session创建一个邮件消息
			Message mailMessage = new MimeMessage(sendMailSession);
			// 创建邮件发送者地址
			Address from = new InternetAddress(this.getFromAddress());
			// 设置邮件消息的发送者
			mailMessage.setFrom(from);
			// 创建邮件的接收者地址，并设置到邮件消息中
			Address to = new InternetAddress(mailInfo.getToAddress());
			// Message.RecipientType.TO属性表示接收者的类型为TO
			mailMessage.setRecipient(Message.RecipientType.TO, to);
			// 设置邮件消息的主题
			mailMessage.setSubject(mailInfo.getSubject());
			// 设置邮件消息发送的时间
			mailMessage.setSentDate(new Date());
			// MiniMultipart类是一个容器类，包含MimeBodyPart类型的对象
			Multipart mainPart = new MimeMultipart();
			// 创建一个包含HTML内容的MimeBodyPart
			BodyPart html = new MimeBodyPart();
			// 设置HTML内容
			html.setContent(mailInfo.getContent(), "text/html; charset=utf-8");
			mainPart.addBodyPart(html);
			// 将MiniMultipart对象设置为邮件内容
			mailMessage.setContent(mainPart);
			long start = System.currentTimeMillis();
			// 发送邮件
			Transport.send(mailMessage);
			logger.info("sendHtmlMail cost :{}", System.currentTimeMillis()
					- start);
			return true;
		} catch (Exception ex) {
			logger.error("sendHtmlMail", ex);
		}
		return false;

	}

	private class SendMailTask implements Runnable {
		private boolean isRunning = false;

		@Override
		public void run() {
			while (true) {
				if (!isRunning) {
					isRunning = true;
					writeLock.lock();
					try {
						isRead = true;
						readQueue = writeQueue;
						initWriteQueue();
						canWrite.signalAll();
					} finally {
						isRead = false;
						writeLock.unlock();
					}

					ExecutorService es = Executors
							.newFixedThreadPool(sendThreadNum);
					for (int i = 0; i < sendThreadNum; i++) {
						es.execute(new SendMailProcess(i));
					}
					es.shutdown();
					isRunning = false;
				}
				try {
					Thread.sleep(sendTimeInterval * 1000L);
				} catch (InterruptedException e) {
					// ignore
				}
			}
		}
	}

	private class SendMailProcess implements Runnable {
		private int index;

		public SendMailProcess(int i) {
			this.index = i;
		}

		@Override
		public void run() {
			BlockingQueue<MailSenderInfo> queue = readQueue.get(index);
			while (!queue.isEmpty()) {
				MailSenderInfo aMailSenderInfo = queue.poll();
				doSendHtmlMail(aMailSenderInfo);
			}
			clearQueue(queue);
		}
	}

	private void clearQueue(BlockingQueue<MailSenderInfo> queue) {
		if (queue != null) {
			queue.clear();
			queue = null;
		}
	}

	/**
	 * @return the logger
	 */
	public Logger getLogger() {
		return logger;
	}

	/**
	 * @param logger
	 *            the logger to set
	 */
	public void setLogger(Logger logger) {
		this.logger = logger;
	}

	/**
	 * @return the mailServerHost
	 */
	public String getMailServerHost() {
		return mailServerHost;
	}

	/**
	 * @param mailServerHost
	 *            the mailServerHost to set
	 */
	public void setMailServerHost(String mailServerHost) {
		this.mailServerHost = mailServerHost;
	}

	/**
	 * @return the mailServerPort
	 */
	public String getMailServerPort() {
		return mailServerPort;
	}

	/**
	 * @param mailServerPort
	 *            the mailServerPort to set
	 */
	public void setMailServerPort(String mailServerPort) {
		this.mailServerPort = mailServerPort;
	}

	/**
	 * @return the validate
	 */
	public boolean isValidate() {
		return validate;
	}

	/**
	 * @param validate
	 *            the validate to set
	 */
	public void setValidate(boolean validate) {
		this.validate = validate;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName
	 *            the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the fromAddress
	 */
	public String getFromAddress() {
		return fromAddress;
	}

	/**
	 * @param fromAddress
	 *            the fromAddress to set
	 */
	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}

	/**
	 * @return the mailContextMap
	 */
	public Map<Integer, String> getMailContextMap() {
		return mailContextMap;
	}

	/**
	 * @return the sendThreadNum
	 */
	public Integer getSendThreadNum() {
		return sendThreadNum;
	}

	/**
	 * @param sendThreadNum
	 *            the sendThreadNum to set
	 */
	public void setSendThreadNum(Integer sendThreadNum) {
		this.sendThreadNum = sendThreadNum;
	}

	/**
	 * @return the sendTimeInterval
	 */
	public Integer getSendTimeInterval() {
		return sendTimeInterval;
	}

	/**
	 * @param sendTimeInterval
	 *            the sendTimeInterval to set
	 */
	public void setSendTimeInterval(Integer sendTimeInterval) {
		this.sendTimeInterval = sendTimeInterval;
	}
}
