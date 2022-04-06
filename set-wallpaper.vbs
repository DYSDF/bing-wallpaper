Dim shApp, picFile, items
Dim bingPic
If (WScript.Arguments.Count > 0) Then
    bingPic = Wscript.Arguments(0)
    If (CreateObject("Scripting.FileSystemObject").FileExists(bingPic)) Then
        Set shApp = CreateObject("Shell.Application")
        Set picFile = CreateObject("Scripting.FileSystemObject").GetFile(bingPic)
        Set items = shApp.NameSpace(picFile.ParentFolder.Path).ParseName(picFile.Name).Verbs
        For Each item In items
          If item.Name = "设置为桌面背景(&B)" Then item.DoIt
        Next
        WScript.Sleep 5000
    End If
Else
    MsgBox "指定的图片找不到, 请指定图片位置"
End If
