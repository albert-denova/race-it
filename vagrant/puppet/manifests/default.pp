Exec { path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ] }

exec { 'add-nodesource-repo':
	command => "curl -sL https://deb.nodesource.com/setup | sudo bash -",
}
exec { 'add-ubuntu-git-maintainers-repo':
	command => "add-apt-repository ppa:git-core/ppa",
}

class system-update {
	exec { 'apt-get update':
		command => 'apt-get update',
  }
}

class system-upgrade {
	exec { 'apt-get upgrade':
        	command => 'apt-get upgrade -y',
    }
}

class js_packages {
	package { "nodejs":
    		ensure => "latest"
    }    
}

class tools_packages {
	package { "git":
		ensure => "latest"
	}
}
class bower_install {
	exec { 'install-bower':
		command => 'npm install -g bower',
	}
}

class grunt_install {
        exec { 'install-grunt':
                command => 'npm install -g grunt-cli',
        }
}

class express_install {
    exec { 'install-express':
        command => 'npm install -g express'
    }
}

class socket_install {
    exec { 'install-socket': 
        command => 'npm install -g socket.io'
    }    
}

class socket_mock_install {
    exec { 'install-socket-mock':
        command => 'npm install -g socket-io-mock'
    }
}

class p2_install {
    exec { 'install-p2':
        command => 'npm install -g p2'
    }
}

class nodeunit_install {
    exec { 'install-nodeunit':
        command => 'npm install -g nodeunit'
    }
}

include system-update
include system-upgrade
include js_packages
include tools_packages
include bower_install
include grunt_install
include express_install
include socket_install
include socket_mock_install
include p2_install
include nodeunit_install