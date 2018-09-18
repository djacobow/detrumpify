
# Creating an uploadable package for Edge

Edge is by far the most difficult platform to build for so far!

Here are most of the steps.

## Fixing up the Extension for Edge

Edge is seriously borked, and needs some fixup code in order to run a web
extension that Chrome and Firefox can run just as it is.

0. Install git, vim, gnuwin tools to pull down the extension
   From git

1. Obtain the Microsoft Edge Extension Toolkit from the MS Store

2. Make the necessary changes. I didn't notice any code changes,
   but the tool added some MS files and really changed the manifest.
   It also added a background page to run the event.js code, because
   MS doesn't fully understand background pages.

   The tool also didn't like the README.md in th historical folder,
   so you may need to zap that.


## Test running the Extension

1. Open Edge and goto about:flags.

   Turn on extension developing

2. Close and restart edge

3. Go to "..." in Edge -> Extensions, then scroll to the bottom 
   to find load, then load the extension locally and try it out. 
   You probably will have to turn it on again, too.

Test in the normal manner.


## Packaging The Extension


Links:
  * https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging
  * https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/using-manifoldjs-to-package-extensions

0. Install nodejs
1. Install manifoldjs 

   `npm -g install manifoldjs`

2. Use manifoldjs to pre-package the extension.

 
   `manifoldjs -l debug -p edgeextension -f edgeextension -m <...>\Detrumpify\manifest.json -d workarea`

3. Then you have to edit: `<workarea>/Detrumpify/edgeextension/manifest/appxmanifest.xml`

   You'll need to adjust some icon locations and fix the publisher identifier:

   Useful link:
     * https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/creating-and-testing-extension-packages#app-identity-template-values


```
<?xml version="1.0" encoding="utf-8"?>
<Package 
	xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
	xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
	xmlns:uap3="http://schemas.microsoft.com/appx/manifest/uap/windows10/3"
	IgnorableNamespaces="uap3">
	<Identity 
		Name="secret_stuff"
		Publisher="CN=secret_stuff"
		Version="1.2.8.0" />

	<Properties> 
		<DisplayName>Detrumpify</DisplayName> 
		<PublisherDisplayName>Tools of Our Tools</PublisherDisplayName>
		<Logo>Assets\dt-50.png</Logo> 
	</Properties> 

	<Dependencies> 
		<TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.15063.0" MaxVersionTested="10.0.15063.0" />
	</Dependencies> 

	<Resources>
		<Resource Language="en-us" />
		<Resource uap:Scale="200"/>
	</Resources> 

	<Applications> 
		<Application Id="App">
			<uap:VisualElements
				AppListEntry="none"
				DisplayName="Detrumpify"
				Square150x150Logo="Assets\dt-150.png"
				Square44x44Logo="Assets\dt-44.png"
				Description="Replaces references to Donald Trump with more accurate descriptions."
				BackgroundColor="transparent">
			</uap:VisualElements>
			<Extensions>
				<uap3:Extension Category="windows.appExtension">
					<uap3:AppExtension
						Name="com.microsoft.edge.extension"
						Id="EdgeExtension"
						PublicFolder="Extension"
						DisplayName="Detrumpify">
						<uap3:Properties>
							<Capabilities>
								<Capability Name="websiteContent"/>
								<Capability Name="browserStorage"/>
								<Capability Name="websiteInfo"/>
							</Capabilities>
						</uap3:Properties>
					</uap3:AppExtension>
				</uap3:Extension>
			</Extensions>
		</Application> 
	</Applications>
</Package>
```


4. For those icon files, copy over everything from icons/ folder to the <workearea>\Detrumpify\edgeextension\Assets folder.

5. Now you need to re-run manifold to actually package the extension:

    `manifoldjs -l debug -p edgeextension package <workarea>\Detrumpify\edgeextension\manifest\`

   This will create the packaged extension itself, which you will find in <workarea>\Detrumpify\edgeextension\package


## Testing the package

Testing on of these appx packages is not easy. You need to sign it before 
you can load it and test it.

Links:
   * https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/creating-and-testing-extension-packages#testing-an-appx-package
   * https://docs.microsoft.com/en-us/windows/uwp/packaging/create-certificate-package-signing
   * https://docs.microsoft.com/en-us/windows/desktop/appxpkg/how-to-sign-a-package-using-signtool
   * https://docs.microsoft.com/en-us/powershell/module/pkiclient/export-certificate?view=win10-ps


0. Install the Microsoft SDK to you can get a utility called "signtool.exe"

1. Get your publisher identity, name, etc from the Windows Dev Center 
   dashboard. It's all under App Management => App Identity


   Use that Publisher info here:

   `New-SelfSignedCertificate -Type Custom -Subject "CN=secret_stuff" -FriendName toot -CertStoreLocation "Cert:\LocalMachine\My\"`

   You can check that it is there with:

```
   Set-Location Cert:\LocalMachine\My
   Get-ChildItem
```

You should get something like:

```
Thumbprint                                Subject
----------                                -------
0E17760DF83D1415E07B9B5C3DEB0FA4441E8455  CN=CD84993F-08C4-47FB-BA55-7F5262A68E48
```

That thumbprint is what you use to ID the cert going forward.

2. Generate a .pfx file for signing the package:

First, make a password:

`$pwd = ConvertTo-SecureString -String <Your Password> -Force -AsPlainText`

Then use that password to make the signing file:

Export-PfxCertificate -cert "Cert:\LocalMachine\My\<Certificate Thumbprint>" -FilePath <FilePath>/toot.pfx -Password $pwd
 

3. Now export another version of the cert so that computer trusts it

```
$cert = (Get-ChildItem -Path cert:\CurrentUser\My\<thumbprint>)
Export-Certificate -Cert $cert -FilePath <somepath>toot.sst -Type SST
Certutil -addStore TrustedPeople toot.sst
```


4. Now you can sign the package


   Find signtool.exe. It should be in `c:\Program Files (x86)\Windows Kits\10\bin\10.0.17134.0\x64` or similar.

   Now run:

   `signtool.exe sign /fd SHA256 /a /f toot.pfx /p <password_we_used_above> <path_to_the_appx_package>\edgeExtension.appx`


5. Now you can install the package you made before

   Add-AppxPackage <path_to_appx>


6. Now, wasn't that fun?!?!?



## Uploading the Extension

This is done on the developer dashboard. When you upload there will a 
validation step and there will likely be errors, so that's life.
 



# Useful Links

Microsoft Dev Dashboard:
    https://partner.microsoft.com/en-us/dashboard
