# 投稿确认邮件：学校接入说明

> 历史方案，已由 Gmail SMTP 方案替代。当前部署步骤以 [supabase/README.md](../supabase/README.md#submission-confirmation-email) 为准；下文 Resend、学校接管和占位域名要求不再用于当前部署。

## 当前状态

注册、登录、个人信息和投稿仍使用 Supabase。SAVE 保存文字及选择的新文件；SUBMIT 保存投稿并标记 submitted。

**确认邮件代码已经完成，但尚未启用。当前没有已验证域名和发信密钥；页面“提交成功”不表示邮件已发出。**

## 迁移与复用

- 只迁网站、保留 Supabase：现有账户和投稿功能可继续使用。调整 Vite base、SPA 路由回退和 Supabase 登录回跳地址。
- 邮件：当前预留 Supabase Edge Function + Resend；学校提供 SMTP 后，只需替换该函数的发信层，投稿页面无需重写。
- 若同时替换 Supabase：账户、数据库、文件存储及权限规则需要另做迁移，不能仅复制网页文件完成。

GitHub Pages 只能托管静态前端。SMTP 密码不能放进前端或 VITE_ 环境变量。

## 请学校确认

1. 是否允许保留 Supabase；正式网站地址和部署路径。
2. SMTP 主机、端口、TLS、认证方式、允许使用的发件邮箱及发送额度。
3. 可运行邮件接口并访问 SMTP 的后端环境。
4. SPF、DKIM、DMARC 等发信域名设置由谁管理。

密码和密钥通过学校安全渠道或服务器环境变量配置，不发聊天、不提交 GitHub。

## 已实现的发送规则

- Edge Function `send-submission-confirmation` 以登录会话验证用户。
- 服务端读取当前用户已提交的投稿和个人资料，不信任浏览器任意传入的收件人、姓名或题目。
- 数据库提交成功后触发；邮件失败不得撤销投稿或删除文件。
- 按用户 ID 和 submitted_at 生成幂等键，避免短期重复发送。
- 默认发往已验证的账户邮箱；如需发往可修改的 Contact Email，应先实现该地址验证。
- 区分投稿成功、邮件待发送、已发送、发送失败。SMTP 接受不保证进入收件箱。

## 邮件模板

建议主题：GAIA 2027 — Submission confirmation

    Dear {name},

    Your submission has been uploaded for the conference ‘Geomechanics Alliance in Asia’

    The reference of your submission is:
    {paper title}, {name}

    Best Regards,
    GAIA Committee

姓名来自 first_name 和 last_name，题目来自该次提交的 paper_title，由服务端替换。

## 启用前验收

- SAVE 不发邮件；SUBMIT 成功后发邮件；数据库提交失败不发邮件。
- 测试邮箱收到正确姓名和论文题目。
- 拒绝未登录、伪造他人投稿和重复发送请求。
- SMTP 故障时投稿仍可查看，邮件可以重试。
- 密钥仅存在服务端；检查发信域名配置及垃圾邮件情况。

预留发件人写法为 `GAIA Committee <noreply@gaia-2027.hk>`。它只是配置示例；取得并验证该域名前不能启用。域名不能写成 `GAIA_2027.hk`，因为邮件域名不允许下划线。

启用 Resend 时：部署 `send-submission-confirmation`，在 Edge Function Secrets 中设置 `RESEND_API_KEY`、`GAIA_EMAIL_FROM`、`GAIA_SITE_ORIGIN`，再将 GitHub Repository variable `VITE_SUBMISSION_CONFIRMATION_EMAIL_ENABLED` 设为 `true` 并重新部署网站。

Supabase 注册验证/重置密码邮件与投稿确认邮件是两套流程，配置 Auth SMTP 不会自动生成投稿确认邮件。

参考：[SMTP 接入](https://nodemailer.com/smtp)、[Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp)。
