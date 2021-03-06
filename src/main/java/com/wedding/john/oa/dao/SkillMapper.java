package com.wedding.john.oa.dao;

import com.wedding.john.oa.bean.Skill;
import com.wedding.john.oa.bean.SkillExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface SkillMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int countByExample(SkillExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int deleteByExample(SkillExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int deleteByPrimaryKey(Integer id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int insert(Skill record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int insertSelective(Skill record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    List<Skill> selectByExample(SkillExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    Skill selectByPrimaryKey(Integer id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int updateByExampleSelective(@Param("record") Skill record, @Param("example") SkillExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int updateByExample(@Param("record") Skill record, @Param("example") SkillExample example);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int updateByPrimaryKeySelective(Skill record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table skill
     *
     * @mbggenerated
     */
    int updateByPrimaryKey(Skill record);
}