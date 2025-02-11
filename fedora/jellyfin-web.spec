%global         debug_package %{nil}

Name:           jellyfin-web
Version:        10.8.13
Release:        1%{?dist}
Summary:        The Free Software Media System web client
License:        GPLv3
URL:            https://jellyfin.org
# Jellyfin Server tarball created by `make -f .copr/Makefile srpm`, real URL ends with `v%%{version}.tar.gz`
Source0:        jellyfin-web-%{version}.tar.gz

BuildArch:		noarch
%if 0%{?rhel} > 0 && 0%{?rhel} < 8
BuildRequires:	nodejs
%else
BuildRequires:	git
BuildRequires:	npm
%endif

# Disable Automatic Dependency Processing
AutoReqProv:    no

%description
Jellyfin is a free software media system that puts you in control of managing and streaming your media.


%prep
%autosetup -n jellyfin-web-%{version} -b 0

%build

%install
%if 0%{?rhel} > 0 && 0%{?rhel} < 8
# Required for CentOS build
chown root:root -R .
%endif
npm ci --no-audit --unsafe-perm
%{__mkdir} -p %{buildroot}%{_datadir}
mv dist %{buildroot}%{_datadir}/jellyfin-web
%{__install} -D -m 0644 LICENSE %{buildroot}%{_datadir}/licenses/jellyfin/LICENSE

%files
%defattr(644,root,root,755)
%{_datadir}/jellyfin-web
%{_datadir}/licenses/jellyfin/LICENSE

%changelog
* Tue Nov 28 2023 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.13; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.13
* Sat Nov 04 2023 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.12; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.12
* Sat Sep 23 2023 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.11; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.11
* Sun Apr 23 2023 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.10; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.10
* Sun Jan 22 2023 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.9; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.9
* Tue Nov 29 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.8; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.8
* Mon Oct 31 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.7; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.7
* Fri Oct 28 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.6; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.6
* Sat Sep 24 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.5; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.5
* Sat Aug 13 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.4; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.4
* Mon Aug 01 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.3; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.3
* Mon Aug 01 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.2; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.2
* Sun Jun 26 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.1; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.1
* Fri Jun 10 2022 Jellyfin Packaging Team <packaging@jellyfin.org>
- New upstream version 10.8.0; release changelog at https://github.com/jellyfin/jellyfin-web/releases/tag/v10.8.0
* Fri Dec 04 2020 Jellyfin Packaging Team <packaging@jellyfin.org>
- Forthcoming stable release
* Mon Jul 27 2020 Jellyfin Packaging Team <packaging@jellyfin.org>
- Forthcoming stable release
* Mon Mar 23 2020 Jellyfin Packaging Team <packaging@jellyfin.org>
- Forthcoming stable release
