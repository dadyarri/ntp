npx next build
npx next export
mv out\_next out\next
(Get-ChildItem out -Filter *.html -Recurse) | ForEach-Object {
    (Get-Content $_.FullName) | ForEach-Object {
        $_ -replace "/_next", "./next"
    } | Set-Content $_.FullName
}
Copy-Item -Path "out\*" -Destination "C:\Users\dadya\.config\ntp" -Recurse -Force
