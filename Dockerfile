#从已经构建好的jetyy和jdk8镜像构建镜像
FROM finfosoft/jetty-jdk8

#维护者信息
MAINTAINER niuzhifa "1944044667@qq.com"

#打包后的war包放入到容器中
ADD  target/finfosoft-heating-0.0.1-SNAPSHOT.war /home/app/webapps

#改名
RUN  mv /home/app/webapps/finfosoft-heating-0.0.1-SNAPSHOT.war /home/app/webapps/app.war

#暴露端口
EXPOSE 8080

#启动容器的时候执行的命令（在finfosoft/jetty-jdk8这个镜像中）
CMD ["./run.sh"]
