package com.hnasys.cah.employee.service;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import com.alibaba.citrus.test.context.SpringextContextLoader;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:webx-test.xml" }, loader = SpringextContextLoader.class)
public class EmployeeServiceTest extends AbstractTransactionalJUnit4SpringContextTests {
    /*-
     @Autowired
     EmployeeDao dao;
     @Autowired
     EmployeeService service;

     @Test
     public void testDaoService() { 
     // System.out.println("perform method 1");
     Assert.assertNotNull(dao);
     Assert.assertNotNull(service);  
     }
     @Test
     public void testGetMethod() { 
     // System.out.println("perform method 2");
     Employee emp = service.getEmployee(16); 
     //        Assert.assertNotNull(emp); 
     //Assert.assertNotNull(emp.getEmployeeName());
     PagingForm form=new PagingForm();
     PagingResult<Employee> result=service.findPaging(form);
     Assert.assertNotNull(result); 
     //        System.out.println(result.getTotal());
     Assert.assertTrue(result.getRows().size()>1);
     List<?> emps=service.findEmployees(null);
     Assert.assertTrue(emps.size()>1);
     }
     */
}
