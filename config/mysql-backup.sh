#!/bin/bash

#get the day of week as a number (i.e. 1 = Monday, 7 = Sunday)
DAY_OF_WEEK=$(date +%u)

#backup 'my_database' to the folder /var/local/backups/mysql/
#$DAY_OF_WEEK is appendend o the file name in order to keep a weekly history of nthe backups
mysqldump -u root -pWelcome1$ takework > /var/local/backups/mysql/takework_$DAY_OF_WEEK.sql

#use aws (Amazon's tool) to sync your backups to Amazon S3
#/usr/local/bin/aws - the tool
#s3 - the service we want to use
#sync - the command to run
#/var/local/backups/mysql/ - local folder
#s3://my-backups/mysql/ - Amazon s3 folder
#/usr/local/bin/aws s3 sync /var/local/backups/mysql/ s3://backups-takework/mysql/
