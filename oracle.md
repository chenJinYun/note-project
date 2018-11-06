####ORACLE:
- oracle的工作流程：内部原理
- commit是事物结束了，保证数据不会丢失
- 数据库和文件系统的区别
- 数据存在data file
- control file:日志文件
- redo log file:物理日志：先记成日志，在commit的时候日志到了物理日志，可以根据日志进行恢复日志|一个block是8kb
- rodo log实现持久性

####后台进程
- CKPT：checkpoint,相当于自动保存，恢复使用的，
- ARCn:把redo log离线生成一个文件，为了更好地恢复使用
- 现在来看看MySQL数据库为我们提供的四种隔离级别：

　　① Serializable (串行化)：可避免脏读、不可重复读、幻读的发生。

　　② Repeatable read (可重复读)：可避免脏读、不可重复读的发生。

　　③ Read committed (读已提交)：可避免脏读的发生。

　　④ Read uncommitted (读未提交)：最低级别，任何情况都无法保证。
-  undo file:回滚

	表的查询方式：全表查询，索引查询，ROWID查询

	删除表数据使用：truncate,会把hwm恢复到0，不影响查询速度
	全局扫描的利用：索引搜索非常差，
	ROWID：根据物理地址查询
	join:

###索引：唯一性，非唯一性，联合

- Bittree index:
	- 实现的原理：利用了rowid，
	- 树的形状是：矮胖的，因为i/o操作少
	- 外键一定要定一个index
	- 索引不存空值，



- Bitmap index:
	-  olap数据里面，
	
	死锁：两个同user资源被对方占用，都处于等待状态，就会产生死锁。

###执行计划

- 执行顺序，从左向右看，不对齐的先执行，对齐的上面先执行