# Radar visualization for Kibana

This is a plugin developed for Kibana that you can build radar visualziations

## Installation Steps from Kibana docs

    cd KIBANA_HOME
    ./bin/kibana-plugin install \
        https://github.com/dlumbrer/kbn_radar/releases/download/Kibana-6.X/kbn_radar.zip


## Installation Steps from release

1. Go to [releases](https://github.com/dlumbrer/kbn_radar/releases "Go to releases!") and download the right one for your Kibana
2. unzip/untar it into `KIBANA_HOME/plugins`
3. Start your Kibana


## Installation Steps from GitHub source code

1. Move into plugins folder:  `cd KIBANA_HOME/plugins`
2. Clone the source code (**it depends on your Kibana's version**):
    - Kibana 6.3 or upper: `git clone https://github.com/dlumbrer/kbn_radar.git -b 6-dev`
    - Kibana 6.0, 6.1 or 6.2: `git clone https://github.com/dlumbrer/kbn_radar.git -b 6.2-dev`

3. Install dependencies:
      ```
      cd kbn_radar
      npm install
      ```
4. Start Kibana

> **Important:** If you have any problem with the plugin version (like a warning message "**it expected Kibana version "x.x.x", and found "x.x.x"**") only change the value of the "version" tag on the package.json to your Kibana version


#### Uninstall:
```
cd KIBANA_HOME
rm -rf plugins/kbn_radar/
```
or
```
cd KIBANA_HOME
./bin/kibana-plugin remove kbn_radar
```


# Example of use

![Example](public/images/radar_example.png)


## Help me to improve! :smile:

You can contact or helping me if you have any issue by:

- Opening an issue in the repository
- Opening a PR
- Sending an email to [me](mailto:dmorenolumb@gmail.com)!

This is an open source project that I maintain in my free time, as a hobby and my love for open source and data visualization. It is free as you know, but you can help me with a cup of coffee:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HHPTP787VZVZL)
