#Requires -Version 5.1
<#
.SYNOPSIS
  Rebuilds EasyDoc, refreshes the manual project, and publishes the manual to
  master (manual/) and gh-pages (project root).
#>

$ErrorActionPreference = "Stop"
# PowerShell 7.3+: don't turn native non-zero exit codes into terminating errors;
# exit codes are checked explicitly below. Harmless in Windows PowerShell 5.1.
$PSNativeCommandUseErrorActionPreference = $false

# Call npm.cmd directly so PowerShell doesn't pick npm.ps1, which the
# execution policy may block.
$npm = if ($IsWindows -or $PSVersionTable.PSEdition -eq "Desktop") { "npm.cmd" } else { "npm" }

$projectDir = "D:\srv\vhost\easydoc"
$manualProjectDir = "D:\srv\vhost\easydoc_manual"
$manualSourceDir = Join-Path $projectDir "manual"
$manualDocsDir = Join-Path $manualProjectDir "docs"
$manualWwwDir = Join-Path $manualProjectDir "www"

function Invoke-Native {
  param(
    [Parameter(Mandatory)] [string] $Command,
    [string[]] $Arguments = @()
  )
  Write-Host "> $Command $($Arguments -join ' ')" -ForegroundColor Cyan
  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "'$Command $($Arguments -join ' ')' failed with exit code $LASTEXITCODE."
  }
}

function Test-GitChanges {
  $status = git status --porcelain
  if ($LASTEXITCODE -ne 0) {
    throw "'git status' failed with exit code $LASTEXITCODE."
  }
  return [bool]$status
}

function Publish-GitChanges {
  param([Parameter(Mandatory)] [string] $Message)
  if (Test-GitChanges) {
    Invoke-Native git @("add", "-A")
    Invoke-Native git @("commit", "-m", $Message)
    Invoke-Native git @("push")
  } else {
    Write-Host "No git changes to commit." -ForegroundColor Yellow
  }
}

function Copy-DirectoryContents {
  param(
    [Parameter(Mandatory)] [string] $Source,
    [Parameter(Mandatory)] [string] $Destination
  )
  if (-not (Test-Path -LiteralPath $Source -PathType Container)) {
    throw "Source directory not found: $Source"
  }
  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  Copy-Item -Path (Join-Path $Source "*") -Destination $Destination -Recurse -Force
}

Push-Location $projectDir
try {
  # 1. Build EasyDoc assets and site
  Invoke-Native $npm @("run", "sass")
  Invoke-Native $npm @("run", "js")
  Invoke-Native $npm @("run", "build")

  # 2. Copy manual Markdown into the manual project
  New-Item -ItemType Directory -Path $manualDocsDir -Force | Out-Null
  Copy-Item -Path (Join-Path $manualSourceDir "*.md") -Destination $manualDocsDir -Force

  # 3./4. Update and build the manual project
  Push-Location $manualProjectDir
  try {
    Invoke-Native $npm @("run", "update")
    Invoke-Native $npm @("run", "build")
  } finally {
    Pop-Location
  }

  # 5. Copy the built manual into manual/
  Copy-DirectoryContents -Source $manualWwwDir -Destination $manualSourceDir

  # 6./7. Commit and push manual changes on master
  Publish-GitChanges -Message "update manuals"

  # 8. Switch to gh-pages
  Invoke-Native git @("switch", "gh-pages")
  try {
    # 9. Copy the built manual into the project root
    Copy-DirectoryContents -Source $manualWwwDir -Destination $projectDir

    # 10. Commit and push documentation changes
    Publish-GitChanges -Message "update documentation"
  } finally {
    # 11. Back to master
    Invoke-Native git @("switch", "master")
  }
} finally {
  Pop-Location
}

Write-Host "Manuals updated." -ForegroundColor Green
