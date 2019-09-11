<template>
<!--任务详情-->
    <div id="task">
    <div class="indexBody">
        <div class="innerBody">
            <Tabs value="0" :animated="false"  @on-click="detail">
                <TabPane label="任务详情" name="0">
                    <div class="detailPage">
                        <!--上部分绿色的s-->
                        <div class="pageTop">
                            <span class="back"><Icon type="ios-arrow-back" style="margin: 0 0 0 10px;"/><span>返回</span></span>
                            <div class="basicInfoContent">
                                <div class="basicInfo">
                                    <div class="basicInfoBox">
                                        <div class="basicInfoTop">
                                            <span class="basicInfoName" title="5月产品工作几乎">5月产品工作几乎</span>
                                        </div>
                                        <div class="basicInfoBottom">
                                            <ul class="contentBox">
                                                <li><span>任务时间：</span></li>
                                                <li><span>任务类型：</span></li>
                                                <li><span>任务状态：</span></li>
                                            </ul>

                                            <div class="timeCount"> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--上部分绿色的e-->
                        <!--中部分白色的s-->
                        <div class="pageMiddle">
                            <div id="menuScroll" class="clearfix">
                                <div class="menu clearfix">
                                <Tabs :animated="false" id="detailContent">
                                    <TabPane label="任务信息">
                                        <div class="flexField">
                                            <div class="header">
                                                <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20"/>
                                                <span class="basicFlexName">任务信息</span>
                                                <div class="buttonBox">
                                                    <Button>编辑</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="taskContent">
                                            <Row class="rowContent" type="flex" justify="center">
                                                <Col span="8">
                                                    <Col span="4"> 任务名称:</Col>
                                                    <Col span="20" offset="">
                                                        <p>这是任务名称</p>
                                                    </Col>
                                                </Col>
                                                <Col span="8">
                                                    <Col span="4"> 任务类型:</Col>
                                                    <Col span="20" offset="">
                                                        <p>普通任务</p>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <Row class="rowContent" type="flex" justify="center">
                                                <Col span="8">
                                                    <Col span="4">接收人:</Col>
                                                    <Col span="20" offset="">
                                                        <p>套上线</p>
                                                    </Col>
                                                </Col>
                                                <Col span="8">
                                                    <Col span="4">提出人：</Col>
                                                    <Col span="20">
                                                        <p>魔鬼😈</p>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <Row class="rowContent"  type="flex" justify="center">
                                                <Col span="8">
                                                    <Col span="4">发起人:</Col>
                                                    <Col span="20" offset="">
                                                        <p>汪黛玉</p>
                                                    </Col>
                                                </Col>
                                                <Col span="8">
                                                    <Col span="4">顾问:</Col>
                                                    <Col span="20">
                                                        <p>老孔</p>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <Row class="rowContent" type="flex" justify="center">
                                                <Col span="8">
                                                    <Col span="4">任务状态:</Col>
                                                    <Col span="20" offset="">
                                                        <p>待确认</p>
                                                    </Col>
                                                </Col>
                                                <Col span="8">
                                                    <Col span="4">任务等级:</Col>
                                                    <Col span="20">
                                                        <p>C</p>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <Row class="rowContent">
                                                <Col span="8" offset="4">
                                                    <Col span="4">截止时间:</Col>
                                                    <Col span="20" offset="">
                                                        <p>2019-7-3</p>
                                                    </Col>
                                                </Col>
                                            </Row>
                                            <Row class="rowContent">
                                                <Col span="8" offset="4">
                                                    <Col span="4">任务描述:</Col>
                                                    <Col span="20" offset="">
                                                        <p>巴拉巴拉巴拉巴拉巴拉巴拉巴拉吧巴拉巴拉巴拉巴拉巴拉巴拉巴拉吧</p>
                                                    </Col>
                                                </Col>
                                            </Row>
                                        </div>
                                    </TabPane>
                                    <TabPane label="附件上传">附件上传</TabPane>
                                    <TabPane label="任务方案">任务方案</TabPane>
                                    <TabPane label="日志区">日志区</TabPane>
                                </Tabs>
                                </div>
                            </div>

                        </div>
                        <!--中部分白色的e-->
                    </div>
                </TabPane>
                <TabPane label="我发起的任务" name="1"></TabPane>
                <TabPane label="我接受的任务" name="2"></TabPane>
                <TabPane label="我执行的任务" name="3"></TabPane>
                <TabPane label="我关注的任务" name="4"></TabPane>
                <TabPane label="全部任务" name="5"></TabPane>
                <TabPane label="待审任务" name="6"></TabPane>
                <TabPane label="悬赏任务" name="7"></TabPane>
                <TabPane label="部门任务" name="8"></TabPane>
                <TabPane label="月度评审" name="9"></TabPane>
            </Tabs>
        </div>
    </div>
</div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      edit: false,
      show: true
    }
  },
  methods: {
    detail (name) {
      switch (name) {
        case '0':
          this.$router.push({
            name: 'taskDetail'
          })
          break
        case '1':
          this.$router.push({
            name: 'taskPropose'
          })
          break
        case '2':
          this.$router.push({
            name: 'taskAccept'
          })
          break
        case '3':
          this.$router.push({
            name: 'taskExcute'
          })
          break
        case '4':
          this.$router.push({
            name: 'taskFocus'
          })
          break
        case '5':
          this.$router.push({
            name: 'taskAll'
          })
          break
        case '6':
          this.$router.push({
            name: 'taskPending'
          })
          break
        case '7':
          this.$router.push({
            name: 'taskReward'
          })
          break
        case '8':
          this.$router.push({
            name: 'taskDepart'
          })
          break
        case '9':
          this.$router.push({
            name: 'taskMonthly'
          })
          break
      }
    }
  }
}
</script>

<style scoped>
.menu{
    width:100%;
}
.taskContent{
    font-size:14px;
}
.rowContent{
    padding:30px;
}
.detailPage .pageTop{
    width: 100%;
    height: 300px;
    padding: 11px 10px 0 10px;
    background: #19aa8d;
    position: relative;
}
.pageTop .back{
    display: inline-block;
    width: 70px;
    height: 30px;
    border: 1px solid #FFFFFF;
    border-radius: 3px;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 26px;
    opacity: 0.5;
    margin: 10px 10px;
    cursor: pointer;
}
.pageTop .basicInfoContent{
    margin: 13px 0 0 0;
    padding: 0 95px;
    width: 100%;
    position: relative;
    z-index: 0;
}
.basicInfoContent .basicInfo{
    display: flex;
}
.basicInfo .basicInfoBox{
    width: 100%;
    margin: 0 0 0 43px;
    color: #fff;
}
.basicInfo .basicInfoTop{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #fff;
}
.basicInfoBox .basicInfoName{
    display: inline-block;
    font-size: 24px;
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}

.basicInfoBox .basicInfoBottom{
    width: 100%;
    margin: 20px 0 0 0;
}
.basicInfoBox .contentBox{
    margin: 0;
    padding: 0;
    display: inline-block;
}
.basicInfoBox .timeCount{
    float: right;
}
.detailPage .pageMiddle{
    margin: -60px 70px 100px 70px;
    position: relative;
    background: #fff;
    padding: 30px 30px;
    border-radius: 7px;
    box-shadow: 0 2px 13px 0 rgba(0, 0, 0, 0.12);
}
.clearfix{
    zoom:1;
    overflow: hidden
}
.pageMiddle .menu{
    display: inline-block;
}
.pageMiddle .menu ul {
    margin: 0;
    padding: 0;
    float: left;
}
.pageMiddle .menu ul li{
    margin: 0 10px 0 0;
    font-size: 14px;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    cursor: pointer;
}
.pageMiddle .menu ul span {
    margin: 0 0 0 10px;
}
.pageMiddle .menu ul .menuActive{
    color: #19aa8d !important;
}
.flexField{
    margin-top: 20px;
}
.flexField .header{
    padding: 0 0 10px 0;
    border-bottom: 1px solid #E0E0E0;
}
.flexField .basicFlexName{
    font-size: 18px;
    color: #333333;
    vertical-align: middle;
    margin: 0 0 0 10px;
}
.flexField .buttonBox{
    float:right;
}

.flexField .ivu-btn {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}
.flexField .ivu-btn {
    box-shadow:  #19aa8d;
}
.indexBody #detailContent .ivu-tabs-bar{
    border-bottom:none;
}

</style>
