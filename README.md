I have tried to make this closer to a team project. Creating issues that you would pickup in a team.
being a QA on the last project has given me some new insights and perspectives.
The following is our criteria:
Pages & User Stories
The respective endpoints associated with the pages are supplied alongside the name of the page. Note that for the endpoints, the <name> will be replaced by your registered username and <id> will be replaced by the ID value of a given blog post item. On the next line, the sitemap path defines the structure of the files; e.g. “/account/login.html” refers to the login.html page inside the ‘account’ folder. Please see the following pages and their respective user stories required by the client:



Blog Feed Page

Method: GET /blog/posts/<name>

Path: /index.html
Requirements:

The Blog Feed Page must include a carousel and a list of at least 12 posts.
User stories:

*As a user, I want to see an interactive banner carousel on the blog feed page, so that I can view a rotation of the three latest posts.

*As a user, I want to click on the previous or next button in the carousel to animate and reveal another post, to ensure I can see different posts easily.

*As a user, I want the carousel to return to the first post after reaching the end of the list, and vice versa when clicking previous on the first post.

*As a user, I want to click on a button for each carousel item, which will take me to the blog post page, where I can read more.

*As a user, I want to view a list of the 12 latest posts in a responsive thumbnail grid on the blog feed page, so I can easily select which post to read.

*As a user, I want each thumbnail image in the blog post feed to be clickable, taking me to the blog post page to read more about that specific blog post.


Specific Blog Post Page

Method: GET /blog/posts/<name>/<id>

Path: /post/index.html
Requirements:

The Specific Blog Post Page features more details about a specific blog post that was navigated to from the thumbnail of the Blog Feed Page.
User stories:

*As a user, I want to see a responsive layout showing the post’s title, author, publication date, image banner, and main content fetched from the API.

*As a user, I want each specific blog page to have a “share” icon with a shareable URL (including a query string or hash parameter containing the post ID), so I can share the post with others easily. 


Create Blog Post Page

Method: POST /blog/posts/<name>

Path: /post/create.html
Requirements:

The Create Blog Post Page features a form that accepts inputs from the owner in order to create a blog post.
User stories:

*As the owner, I want the blog post create page to be available only when logged in, to ensure no unauthorised blog posts are created.

*The blog post form must accept a title, body and media inputs and be visible on the Blog Feed Page once created.


Blog Post Edit Page

Method: 

PUT /blog/posts/<name>/<id>

DELETE /blog/posts/<name>/<id>

Path: /post/edit.html
Requirements:

*The Blog Post Edit Page features a form that gives an owner the ability to edit or delete a post.
User stories:

*As the owner, I want the blog post edit page to be available only for me when logged in, to ensure no unauthorised edits or deletions can be made to my posts.

*As the owner, I want a delete button on the edit form that sends a DELETE request to the API for this post ID on the edit page, so I can easily remove my post if needed.

*As the owner, I want a validated edit form that allows me to update the title, body content, or image by sending a POST request to the API for this post ID, ensuring I can keep my posts up to date easily.


Account Login Page

Method: POST /auth/login

Path: /account/login.html
User stories:

*As the owner, I want a validated login form that allows me to request and save a token to my browser by entering my email and password, allowing me to manage posts.


Account Register Page

Method: POST /auth/register

Path: /account/register.html
User stories:

*As the owner, I want a validated register form that allows me to create a new account by entering my email and password.
