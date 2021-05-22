window.onload = function () {
	let showNav = true;
	const toggleNav = () => {
		showNav = !showNav;
		const nav = document.querySelector(".mobile-nav");
		if (showNav) {
			nav.style.display = "block";
		} else nav.style.display = "none";
	};
	document.querySelector(".bars").addEventListener("click", toggleNav);

	  // show timestamp in readable format
  // Epochs
  const epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  // Get duration
  const getDuration = (timeAgoInSeconds) => {
    for (let [name, seconds] of epochs) {
      const interval = Math.floor(timeAgoInSeconds / seconds);

      if (interval >= 1) {
        return {
          interval: interval,
          epoch: name,
        };
      }
    }
  };

  // Calculate
  const timeAgo = (date) => {
    const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    const { interval, epoch } = getDuration(timeAgoInSeconds);
    const suffix = interval === 1 ? '' : 's';

    return `${interval} ${epoch}${suffix} ago`;
  };

	const getData = async () => {
		let res = await fetch("https://david-search-github-clone.netlify.app/.netlify/functions/githubclone", {
			method: "GET",
		});
		let data = await res.json();
		console.log(data);
		// injectData(data.data.viewer);
	};

	// const getData = async () => {
	// 	let name= "Vectormike"
	// 	let query = `query{
	// 		user(login:"${name}")  {
	// 			login
	// 			repositories(last: 20) {
	// 				edges {
	// 					node {
	// 						id
	// 						url
	// 						updatedAt
	// 						primaryLanguage {
	// 							color
	// 							name
	// 						}
	// 						name
	// 						description
	// 						forkCount
	// 						isPrivate
	// 						stargazerCount
	// 					}
	// 				}
	// 			}
	// 			avatarUrl
	// 			bio
	// 			name
	// 		}
	// 	}`
	// 	let res = await fetch("https://api.github.com/graphql", {
	// 		method: "POST",
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: `bearer 20ea021f1bc180a48c27089ecafe49e38d9db4b4`,
	// 		},
	// 		body: JSON.stringify({
	// 			query,
	// 		}),
	// 	});
	// 	let data = await res.json();
	// 	console.log(data);
	// 	// injectData(data.data.viewer);
	// };

	const injectData = (data) => {
		// add avatar images
		let imgs = document.querySelectorAll(".user-img");
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].src = data.avatarUrl;
		}
		// add usernames
		let user_names = document.querySelectorAll(".user-name");
		for (let i = 0; i < user_names.length; i++) {
			user_names[i].innerText = data.login;
		}

		let profileNames = document.querySelectorAll(".profile-names");
		for (let i = 0; i < profileNames.length; i++) {
			profileNames[i].firstChild.nextSibling.innerText = data.name;
			profileNames[i].firstChild.nextSibling.nextElementSibling.innerText = data.login;
		}
		// add bio
		let bio = document.querySelectorAll(".bio-text");
		for (let i = 0; i < bio.length; i++) {
			bio[i].innerHTML = data.bio;
		}

		// add repos list
		let repoCon = document.querySelector(".repo-con");
		let repoList = data.repositories.edges;
		let reposView = repoList.map((view) => {
			var month = new Array();
			month[0] = "Jan";
			month[1] = "Feb";
			month[2] = "Mar";
			month[3] = "Apr";
			month[4] = "May";
			month[5] = "Jun";
			month[6] = "Jul";
			month[7] = "Aug";
			month[8] = "Sep";
			month[9] = "Oct";
			month[10] = "Nov";
			month[11] = "Dec";
			let repoMonth = month[new Date(view.node.updatedAt).getMonth()];
			let repoDay = new Date(view.node.updatedAt).getDay();

			return `<div class="repos-list mt">
		<div class="">
			<a href="${view.node.url}">	<h3>${view.node.name}</h3></a>
			<p>${view.node.description ? view.node.description : ""}</p>
			<div class="d-flex mt repo-info">
			${
				view.node.primaryLanguage
					? `<div class="d-flex">
					<div class="language-code" style="background-color:${view.node.primaryLanguage ? view.node.primaryLanguage.color : ""}"></div>
					<p>${view.node.primaryLanguage ? view.node.primaryLanguage.name : ""}</p>
				</div>`
					: ""
			}
				${view.node.forkCount > 0 ? `<p class="d-flex ml"><span class="iconify" data-icon="octicon-star-16" data-inline="false"></span>${view.node.forkCount}</p>` : ""}

				${
					view.node.stargazerCount > 0
						? `<p class="d-flex ml"><span class="iconify" data-icon="octicon-repo-forked-16" data-inline="false"></span> <span>${view.node.stargazerCount}</span></p>`
						: ""
				}
				<p class="${view.node.primaryLanguage ? "ml" : ""}">Updated on ${repoMonth} ${repoDay}</p>
			</div>
		</div>
		<div class="mt">
			<button class="d-flex"> <span class="iconify" data-icon="octicon-star-16" data-inline="false"></span> <span class="d-flex">Star</span> </button>
		</div>
	</div>	`;
		});
		let allrepos = "";
		for (let i = 0; i < reposView.length; i++) {
			allrepos += reposView[i];
		}
		repoCon.innerHTML = allrepos;
		document.querySelector(".main").style.display = "block";
		document.querySelector(".loader").style.display = "none";
	};

	const isInViewport = () => {
		const rect = document.querySelector(".scrolled").getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	const checkProfileImgScroll = () => {
		let isScrolled = isInViewport();
		isScrolled ? (document.querySelector(".title-name").style.opacity = "0") : (document.querySelector(".title-name").style.opacity = "1");
	};
	document.addEventListener("scroll", checkProfileImgScroll);

	getData();
};
