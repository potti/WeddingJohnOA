package com.wedding.john.oa.services;

import java.util.Date;
import java.util.Properties;

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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.wedding.john.oa.util.MailAuthenticator;
import com.wedding.john.oa.util.MailSenderInfo;

public class SendMailService {

	private Logger logger = LoggerFactory.getLogger(SendMailService.class);

	// 发送邮件的服务器的IP和端口
	private String mailServerHost;
	private String mailServerPort = "25";
	// 是否需要身份验证
	private boolean validate = false;
	// 登陆邮件发送服务器的用户名和密码
	private String userName;
	private String password;
	// 邮件发送者的地址
	private String fromAddress;

	private Properties mailProperties;

	/**
	 * 获得邮件会话属性
	 */
	public void init() {
		mailProperties = new Properties();
		mailProperties.put("mail.smtp.host", this.mailServerHost);
		mailProperties.put("mail.smtp.port", this.mailServerPort);
		mailProperties.put("mail.smtp.auth", validate ? "true" : "false");
	}

	/**
	 * 以文本格式发送邮件
	 * 
	 * @param mailInfo
	 *            待发送的邮件的信息
	 */
	public boolean sendTextMail(MailSenderInfo mailInfo) {
		// 判断是否需要身份认证
		MailAuthenticator authenticator = null;
		if (this.isValidate()) {
			// 如果需要身份认证，则创建一个密码验证器
			authenticator = new MailAuthenticator(this.getUserName(),
					this.getPassword());
		}
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
			mailMessage.setRecipient(Message.RecipientType.TO, to);
			// 设置邮件消息的主题
			mailMessage.setSubject(mailInfo.getSubject());
			// 设置邮件消息发送的时间
			mailMessage.setSentDate(new Date());
			// 设置邮件消息的主要内容
			String mailContent = mailInfo.getContent();
			mailMessage.setText(mailContent);
			// 发送邮件
			Transport.send(mailMessage);
			return true;
		} catch (Exception ex) {
			logger.error("sendTextMail", ex);
		}
		return false;
	}

	/**
	 * 以HTML格式发送邮件
	 * 
	 * @param mailInfo
	 *            待发送的邮件信息
	 */
	public boolean sendHtmlMail(MailSenderInfo mailInfo) {
		// 判断是否需要身份认证
		MailAuthenticator authenticator = null;
		// 如果需要身份认证，则创建一个密码验证器
		if (this.isValidate()) {
			authenticator = new MailAuthenticator(this.getUserName(),
					this.getPassword());
		}
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
			// 发送邮件
			Transport.send(mailMessage);
			return true;
		} catch (Exception ex) {
			logger.error("sendHtmlMail", ex);
		}
		return false;
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
}
