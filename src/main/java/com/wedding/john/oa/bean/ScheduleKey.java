package com.wedding.john.oa.bean;

import java.util.Date;

public class ScheduleKey {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column schedule.cameraman_id
     *
     * @mbggenerated Thu Jul 03 17:15:48 CST 2014
     */
    private Integer cameramanId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column schedule.busydate
     *
     * @mbggenerated Thu Jul 03 17:15:48 CST 2014
     */
    private Date busydate;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column schedule.cameraman_id
     *
     * @return the value of schedule.cameraman_id
     *
     * @mbggenerated Thu Jul 03 17:15:48 CST 2014
     */
    public Integer getCameramanId() {
        return cameramanId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column schedule.cameraman_id
     *
     * @param cameramanId the value for schedule.cameraman_id
     *
     * @mbggenerated Thu Jul 03 17:15:48 CST 2014
     */
    public void setCameramanId(Integer cameramanId) {
        this.cameramanId = cameramanId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column schedule.busydate
     *
     * @return the value of schedule.busydate
     *
     * @mbggenerated Thu Jul 03 17:15:48 CST 2014
     */
    public Date getBusydate() {
        return busydate;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column schedule.busydate
     *
     * @param busydate the value for schedule.busydate
     *
     * @mbggenerated Thu Jul 03 17:15:48 CST 2014
     */
    public void setBusydate(Date busydate) {
        this.busydate = busydate;
    }
}