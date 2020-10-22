!function(cid){
    var toolkit = {
        "ClientAlert": {
            "Program": "[EBSi Download Manager]",
            "Download": "다운로드",
            "Complete": "완료",
            "Error": "에러",
            "isProcessing": "다운로드 중",
            "isCompleted": "\n다운로드 중이거나 이전에 다운로드한 기록이 있습니다.\n계속 하시겠습니까?",
            "ProcessingAlert": this.Program+"\n다운로드 중이거나 이미 완료되었어요."
        }
    };
    console.log(toolkit.ClientAlert.Program+" Client Download Mode: "+GM_info.downloadMode);
    toolkit.getUri = function(e) {
        return ("http://wstr.ebsi.co.kr/M41M2001/"+cid+"/"+cid+"_1M4_"+e+".mp4");
    };

    toolkit.registerDownloadedLecture = function(e, t) {
        localStorage.setItem(e, t);
    };

    toolkit.isDownloaded = function(e) {
        let LectureStatus = localStorage.getItem(e);
        if(LectureStatus == "DOWNLOADED" || LectureStatus == "DOWNLOADING") {
            return true;
        } else return false;
    };


    toolkit.rtnBtn = function(e){
        var q = document.querySelectorAll("#changeA > form > table > tbody td:nth-child(7) > div > span");
        var vodids = document.querySelectorAll("#changeA > form > table > tbody td:nth-child(3)");
        var titles = document.querySelectorAll("#changeA > form > table > tbody td:nth-child(2) > span.sbj.ellipsis.wM280");
        for (let idx = 0; idx < q.length; idx++) {
            const Button = q[idx];
            const vodid = vodids[idx].className;
            const downloadURI = toolkit.getUri(vodid.replace("vod_LS",""));
            let BtnNew = document.createElement("a");
            BtnNew.className = "btn default white btn_print";
            BtnNew.innerText = toolkit.ClientAlert.Download;
            BtnNew.onclick = function(){
                if(!(this.innerText == toolkit.ClientAlert.Download || this.innerText == toolkit.ClientAlert.Error)) {
                    window.alert(toolkit.ClientAlert.ProcessingAlert);
                    return;
                };
                if(toolkit.isDownloaded(vodid)) {
                   if(!window.confirm(toolkit.ClientAlert.Program+toolkit.ClientAlert.isCompleted)) {
                       return false;
                   }
                }
                toolkit.registerDownloadedLecture(vodid, "DOWNLOADING");
                this.innerText = toolkit.ClientAlert.isProcessing;
                var result = GM_download({
                    url: downloadURI,
                    name: titles[idx].innerText+".mp4",
                    onload: function() {
                        BtnNew.innerText = toolkit.ClientAlert.Complete;
                        toolkit.registerDownloadedLecture(vodid, "DOWNLOADED");
                    },
                    onerror: function() {
                        BtnNew.innerText = toolkit.ClientAlert.Error;
                        toolkit.registerDownloadedLecture(vodid, "ERROR");
                    },
                    onprogress: function(e) {
                        BtnNew.innerText = ((e.loaded/e.total)*100).toFixed(1)+"%";
                    }
                });
                console.log(downloadURI);
            };
            Button.innerHTML = "";
            Button.appendChild(BtnNew);
        }
    };
    toolkit.rtnBtn();
}(content_id)