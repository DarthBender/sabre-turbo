# sabre-turbo

## Overview

**sabre-turbo** is the lightweight static site generator based on [node.js](http://nodejs.org). It supports [hogan.js](http://twitter.github.io/hogan.js/) as a template engine, [Bootstrap](http://getbootstrap.com) as a style provider and [Markdown](http://daringfireball.net/projects/markdown/)-based documents as a content providers. 

This site was generated using **sabre-turbo**.

## Installation

Right now project hosted only on GitHub. `npm` installer will be available later. 

For the installation you need to clone GitHub repository:
`git clone https://github.com/DarthBender/sabre-turbo.git`

Than make `sabre` script be available from anywhere:
`ln -s <path-where-you-cloned-repository>/sabre /usr/local/bin/sabre`

##Using

There are two main commands that `sabre` currently using: 

* `sabre init <project name>` creates _project directory_ with initial data seed. If no project name  parameter provided default one `sabre-turbo` is used.  
* `sabre build` generates actual static website based on the edited content into the `./site` folder. This commands executes from the _project directory_.

##Customisation

###Pages
Concept of pages in **sabre-turbo** is pretty simple. Each page source actually just a sub-folder in the `pages` folder. The folder name is used as page identifier. `pages` folder in initial data seed has following structure:

```
pages
├── test_page_1
│   ├── content.md
│   └── page_data.json
├── test_page_2
│   ├── content.md
│   └── page_data.json
└── test_page_3
    ├── content.md
    ├── custom.hjs
    └── page_data.json		
```

Based on this structure three pages will be created. The result of the pages generation will be bunch of folders with names equals the pages links with `index.html` files in there. In this case:

```
site
├── custom-link 		(*)
│   └── index.html	(*)
├── fonts
│   └── ...
├── images
│   └── ...
├── index.html		(*)
├── javascripts
│   └── ...
├── stylesheets
│   └── ...
├── test_page_1		(*)
│   └── index.html	(*)
└── test_page_3		(*)
    └── index.html	(*)
```
The `(*)` marked files and folders are generated ones. So page link form the website perspective will look like `http:\\example.com\some-page`. All materials related to page will be places into result folder. So in case of images it will be simple `http:\\example.com\some-page\image.jpg` link. This will be easly used in page content creation.

Let's look at the source page-folder structure a bit closer.
 
Each page-folder **should** contain

* `page_data.json` the file contains all details about the page

Each page-folder **can** contain

* `content.md` Markdown file with content of the page
* `<some-file>.hjs` [*optional*] [Mustache](http://mustache.github.io/)-based template file that will be used to generate page view. (See [presentation_data]() section.)
* Some images and other materials related to the generated page. I personally recommend to store such files right in the page-folder. It will be easy to maintain, to update and migrate in future.

Let's look at the settings more closely.

#### `page_data.json` ####

This file is required for each page-folder since the generator bases the whole generation process on it. Basically it has tree main section:

```
{
	"common_data":
		{
			"title":"Test page with custom link to"
		},
	"presentation_data": 
		{
			"glyphicon":"glyphicon-tree-deciduous",
			"link":"/custom-link",
			"external":true,
			"disabled":false,
			"page_view":"custom.hjs"
		},
	"user_data":
		{
			"user_stuff":
				[
					{"row_content":"Some super first row!"},
					{"row_content":"And the new row!"},
					{"row_content":"Guess what? The Row!"}
				]
		}
}
```

##### common_data #####
This section represents the main information about the page:

* `title` will be used as a page title


##### presentation_data #####
This section describes the main presentation details of the page

* `disabled` [*required*]: `true` or `false`. In case of `false` appropriate menu item will be disabled. Useful in case of maintenance or so. If *page identifier* equals `half-life-3` page will always be diasabled.
* `glyphicon` [*optional*]: glyphicon from Bootstrap. In case no glyphicon provided `common_data.title` is used
* `link` [*optional*]: link name started with `/`. By default link to the page is the same as *page-identifier* (as folder name) but in case you want custom link for the page this parameter should be set
* `external` [*optional*]: `true` or `false`. In case `link` field points to some external site than appropriate menu item will be added and folder will be created with `index.html` in there which could be used as template for *integrated theme* of some external resource. (See [Integration]() section.)
* `page_view` [*optional*]: name of the Mustache template file. By default `./views/page.hjs` is used as a base template for the page representation but you can define own page template. Page will be tried to locate in the page-folder in case nothing is found default it used. In this case of custom view page template `user_data` section could be useful.

##### user_data #####
The whole section is optional. This section is only used in case you defined own page view template and need additional data for the html generation.

#### `content.md` ####
[Markdown](http://daringfireball.net/projects/markdown/)-based document that will be put into the page body instead of the `{{{page_body}}}` Hogan template Mustache tag.

#### `<some-file>.hjs` ####
Mustache-based template for custom page view. More details at [hogan.js](http://twitter.github.io/hogan.js/)

### `settings.json` ###
Contains all initial site data:

```
{ 
	"title":"Sabre Turbo",
	"home_glyphicon":"glyphicon-home",

	"encoding":"utf8",
	
	"menu_view":"menu.hjs",
	"home_view":"home.hjs",
	"index_view":"index.hjs",
	"page_view":"page.hjs",
	"blog_view":"blog.hjs",
	"entry_data":"page_data.json",

	"page_content_md":"content.md",

	"pages_cache_file":"pages.json"
}
```

Here is more detailed explanation of the all settings. 

* `title` will be used as home page title
*  `home_glyphicon` [*optional*]: sets the name of glyphicon for the home page. In case of absence **home** is used.
*  `encoding` [*required*]: encoding is used for file reading and writing. By default set to **utf8**.
*  `<smthing>_view` [*required*]: several items contains names of the the Mustache templates used by default for each UI element. Could be changed in case of some deep customisation.
*  `page_content_md` [*required*]: default Markdown file name that will be searched for the page content in the each page-folder
*  `pages_cache_file` [*required*]: name of the file that will hold the page data cache. It will be placed in the `./cache` folder

## Integration ##
This section will describe how you can generate template view with proper menu selection and exact look in case you want to embed some blog engine or forum or external website into yours.

Let's for example integrate blog based on [Ghost](http://ghost.org) blog engine. For that let's copy the `blank_page` into the `pages` folder with name `blog`

`cp -r blank_page pages/blog`

Now we need to edit `page_data.json` toset blog link. Let's say it is `http://blog.example.com` and set `external` field to `true`. So the result file will look like:

```
{
	"common_data": 
		{
			"title":"blog"
		},
	"presentation_data":
		{
			"disabled":false,
			"link":"http://blog.example.com",
			"external":true
		}

}
```

And how we are ready to generate template

`sabre build`

As a result you will see the `./blog` folder with `index.html` in there. This HTML file could be used as template for the Ghgost theme, all menus selection, headers and footers will be processed accordingly.
