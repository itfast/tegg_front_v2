import styled from "styled-components";

export const SidebarContainer = styled.div`
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 260px;
		/* background: ${({ theme }) => theme.colors.inputBackgroundColor};
     */
		background: #2b2b2b;
		z-index: 100;
		transition: all 0.5s ease;
	}
	.sidebar.close {
		width: 78px;
	}
	.sidebar .logo-details {
		height: 60px;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.sidebar .logo-details i {
		font-size: 30px;
		color: #00d959;
		height: 50px;
		min-width: 78px;
		text-align: center;
		line-height: 50px;
	}

	.sidebar .logo-details img {
		font-size: 60px;
		color: #000;
		/* height: 50px; */
		/* margin: 0px 25px; */
		margin: auto;
		width: 60%;
		text-align: center;
		line-height: 50px;
	}
	.sidebar .logo-details .logo_name {
		font-size: 22px;
		color: #000;
		font-weight: 600;
		transition: 0.3s ease;
		transition-delay: 0.1s;
	}
	.sidebar.close .logo-details .logo_name {
		transition-delay: 0s;
		opacity: 0;
		pointer-events: none;
	}
	.sidebar .nav-links {
		height: 100%;
		padding: 30px 0 150px 0;
		overflow: auto;
	}
	.sidebar.close .nav-links {
		overflow: visible;
	}
	.sidebar .nav-links::-webkit-scrollbar {
		display: none;
	}
	.sidebar .nav-links li {
		border-radius: 8px;
		position: relative;
		list-style: none;
		transition: all 0.4s ease;
	}
	.sidebar .nav-links li:hover {
		background: ${({ theme }) => theme.colors.inputBackgroundColor};
		/* color:  #000; */
		i {
			color: #000;
		}
		// .link_name {
		// 	color: ${(props) => (props.open ? "#000" : "#fff")};
		// }
		/* i{
      color: #000
    }
    .link_name{
      color: #000
    } */
	}

	/* .sidebar.close .nav-links li:hover {
    background:  ${({ theme }) => theme.colors.inputBackgroundColor};
    color:  #fff;
    /* i{
      color: #000
    } */
	/* .link_name{
      color: #fff
    } */
	/* } */
	*/ .sidebar .nav-links li .iocn-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.sidebar.close .nav-links li .iocn-link {
		display: block;
	}
	.sidebar .nav-links li i {
		height: 50px;
		min-width: 78px;
		text-align: center;
		line-height: 50px;
		color: #00d959;
		font-size: 20px;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	.sidebar .nav-links li.showMenu i.arrow {
		transform: rotate(-180deg);
	}
	.sidebar.close .nav-links i.arrow {
		display: none;
	}
	.sidebar .nav-links li a {
		display: flex;
		align-items: center;
		text-decoration: none;
	}
	.sidebar .nav-links li a .link_name {
		font-size: 18px;
		font-weight: 400;
		color: #fff;
		transition: all 0.4s ease;
	}
	.sidebar.close .nav-links li a .link_name {
		opacity: 0;
		pointer-events: none;
	}
	.sidebar .nav-links li .sub-menu {
		padding: 6px 6px 14px 80px;
		margin-top: -10px;
		background: #1d1b31; //aqui
		display: none;
	}

	.sidebar.close .nav-links li .sub-menu:hover {
		/* background: #00D959;// #1d1b31; //aqui */
		background: ${({ theme }) => theme.colors.inputBackgroundColor};
	}

	.sidebar .nav-links li.showMenu .sub-menu {
		display: block;
	}
	.sidebar .nav-links li .sub-menu a {
		color: #fff;
		font-size: 15px;
		padding: 5px 0;
		white-space: nowrap;
		opacity: 0.6;
		transition: all 0.3s ease;
	}
	.sidebar .nav-links li .sub-menu a:hover {
		opacity: 1;
		color: #000;
	}
	.sidebar.close .nav-links li .sub-menu {
		position: absolute;
		left: 100%;
		top: -10px;
		margin-top: 0;
		padding: 10px 20px;
		border-radius: 0 6px 6px 0;
		opacity: 0;
		display: block;
		pointer-events: none;
		transition: 0s;
		/* .link_name{
      color: '#fff'
    } */
	}
	.sidebar.close .nav-links li:hover .sub-menu {
		top: 0;
		opacity: 1;
		pointer-events: auto;
		transition: all 0.4s ease;
	}
	.sidebar .nav-links li .sub-menu .link_name {
		display: none;
	}
	.sidebar.close .nav-links li .sub-menu .link_name {
		font-size: 18px;
		opacity: 1;
		display: block;
	}
	.sidebar .nav-links li .sub-menu.blank {
		opacity: 1;
		pointer-events: auto;
		padding: 3px 20px 6px 16px;
		opacity: 0;
		pointer-events: none;
	}
	.sidebar .nav-links li:hover .sub-menu.blank {
		top: 50%;
		transform: translateY(-50%);
	}
	.sidebar .profile-details {
		// position: fixed;
		// bottom: 0;
		width: 260px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* background: #1d1b31; */
		padding: 12px 0;
		transition: all 0.5s ease;
	}
	.sidebar.close .profile-details {
		background: none;
	}
	.sidebar.close .profile-details {
		width: 78px;
	}
	.sidebar .profile-details .profile-content {
		display: flex;
		align-items: center;
	}
	.sidebar .profile-details img {
		height: 52px;
		width: 52px;
		object-fit: cover;
		border-radius: 16px;
		margin: 0 14px 0 12px;
		background: #1d1b31;
		transition: all 0.5s ease;
	}
	.sidebar.close .profile-details img {
		padding: 10px;
	}
	.sidebar .profile-details .profile_name,
	.sidebar .profile-details .job {
		color: #000;
		font-size: 18px;
		font-weight: 500;
		white-space: nowrap;
	}
	.sidebar.close .profile-details i,
	.sidebar.close .profile-details .profile_name,
	.sidebar.close .profile-details .job {
		display: none;
	}
	.sidebar .profile-details .job {
		font-size: 12px;
	}
	.home-section {
		position: relative;
		background: #e4e9f7;
		height: 100vh;
		left: 260px;
		width: calc(100% - 260px);
		transition: all 0.5s ease;
	}
	.sidebar.close ~ .home-section {
		left: 78px;
		width: calc(100% - 78px);
	}
	.home-section .home-content {
		height: 60px;
		display: flex;
		align-items: center;
	}
	.home-section .home-content .bx-menu,
	.home-section .home-content .text {
		color: #11101d;
		font-size: 35px;
	}
	.home-section .home-content .bx-menu {
		margin: 0 15px;
		cursor: pointer;
	}
	.home-section .home-content .text {
		font-size: 26px;
		font-weight: 600;
	}
	@media (max-width: 768px) {
		.sidebar.close .nav-links li .sub-menu {
			display: none;
		}
		.sidebar {
			width: 100%;
		}
		.sidebar.close {
			display: none;
			width: 0;
		}
		.home-section {
			left: 78px;
			width: calc(100% - 78px);
			z-index: 100;
		}
		.sidebar.close ~ .home-section {
			width: 100%;
			left: 0;
		}
	}
`;
