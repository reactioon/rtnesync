# (R) Package - RTN Exchange Sync

RESYNC is a module to sync data of exchanges, as a part of a package called rpackage, the module is used to run an RTN node on your machine.

## Install

This tutorial is to install RESYNC on your environment.

### Requirements

All packages below are required to install RESYNC.

	* git >2.0.0
	* node 9.0.0
	* nvm any-version
	* forever any-version
	* php >= 5.4
	* memcached >= 2

OS Recommended: CentOS

### Update machine

first, check if your machine is updated.

```
yum update
yum upgrade
```

Note: if you are using CentOS 8, use 'dnf' instead of 'yum'.

### Git

We require the lowest version of git is 2.2, if you don't have a version higher than 2.2, so update.

* Install Git

```
yum install git -y
```

* Update git

```
yum install http://opensource.wandisco.com/centos/6/git/x86_64/wandisco-git-release-6-1.noarch.rpm
yum install git
```

### NVM + NodeJS

1) First install NVM.

```
curl https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash
```

2) Install NodeJS 9.0.0

```
nvm install 9.0.0
nvm use 9.0.0
```

3) Install forever

```
npm install forever -g
```

### CentOS 6 and 7

#### Install PHP

```
yum install php php-fpm php-common php-cli php-pear php-devel -y
```

#### Install Memcached

```
yum install memcached libmemcached -y
```

#### Install Memcached PHP dependency

```
pecl install memcache
```

### CentOS 8

#### Install PHP and Memcached

```
sudo dnf install memcached libmemcached -y
sudo dnf install php php-fpm php-common php-cli php-pear php-devel -y
sudo dnf install epel-release -y
sudo dnf install https://rpms.remirepo.net/enterprise/remi-release-8.rpm -y
sudo dnf module reset php -y
sudo dnf module enable php:remi-7.4 -y
sudo dnf install php-pecl-memcached php-pecl-memcache -y
```

### PHP

#### Change settings

1. date_timezone = America/Fortaleza

#### Test setup

```
php -i | grep memcache
> memcached support => enabled
> memcache support => enabled
```

### Install (R) Package / Automatically

1. Create a folder

```
cd /
mkdir reactioon
```

1. Download RTNESYNC
```
git clone https://github.com/reactioon/rtnesync.git rtnesync
```

2. Execute installer

```
bash install.rtn
```

Notes:

(1): The packages will be installed on default folder (/reactioon), located on settings.cfg, you can change it.
(2): A cronjob script will be installed on '/etc/cron.d'

### Install (R) Package / Manually

#### Setup environment

```
cd /root
```

#### DEMON

1) Download

```
cd /root
git clone https://github.com/reactioon/demon.git demon
```

2) Setup and Install

```
cp examples/settings.json /root/demon/
create settings.json file in base folder.
```

Note: settings file example is located in example folder.

#### DEMON-PACKAGE-RESYNC

1) Download

```
cd /root/demon/scripts
git clone https://github.com/reactioon/script-resync.git resync
```

#### RTNESYNC

1) Download

```
cd /root
git clone https://github.com/reactioon/rtnesync.git rtnesync
```

2) Install

```
cd /root/rtnesync
npm install
cd /root/rtnesync/apps
cp ../examples/settings.json /root/rtnesync/apps/
```

---

@author: José Wilker <josewilker@reactioon.com>