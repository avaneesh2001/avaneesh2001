from pathlib import Path
import shutil
p=Path('data/experience.toml')
s=p.read_text(encoding='utf-8')
entry='''[[experience_entries]]
role_title = "Senior Engineer"
organization_name = "Qualcomm"
location = "Chennai, India"
duration = "Jun 22, 2026 – Present"
role_summary = "Extending Quartz code intelligence and developer tools across SDK and backend layers"
accent = "emerald"
visible_bullets = [
  "Expanded Quartz code intelligence with SystemC support, component search, and additional file indexing",
  "Enhanced developer workflows with MCP navigation, tool discovery, and Confluence integration",
  "Benchmarked code search performance, latency, and cost"
]
detailed_bullets = [
  "Designed and extended the Quartz code intelligence platform with SystemC support, component search, and indexing for .proto and Android.bp files, expanding codebase coverage and search capabilities",
  "Enhanced developer workflows through hierarchical MCP file navigation, tool discovery, category-wise dependency filtering, and Confluence integration across SDK and backend layers",
  "Benchmarked Quartz against grep and Gtags for search performance, latency, and cost"
]
optional_longer_explanation = "Focused on code intelligence and developer productivity, extending language and build-file coverage while improving discovery, navigation, and integrations across Quartz."
optional_image = ""

'''
s=s.replace('[[experience_entries]]',entry+'[[experience_entries]]',1).replace('duration = "Sep 2023 – Present"','duration = "Sep 2023 – Jun 19, 2026"').replace('role_summary = "Building backend systems, automation frameworks, and LLM-powered developer tools"','role_summary = "Built backend systems, automation frameworks, and LLM-powered developer tools"')
s=s.replace('Built multi-language code dependency graph system','Built a multilingual code dependency graph serving 2400+ active users').replace('improving conditional coverage from 50% to 83%"','improving conditional coverage from 50% to 83% with a 92% acceptance rate"').replace('Developed 40+ O-RAN','Developed 47+ O-RAN').replace('This role spans','This role spanned').replace('Work includes','Work included')
p.write_text(s,encoding='utf-8')
p=Path('data/home.toml'); s=p.read_text(encoding='utf-8')
s=s.replace('Software Engineer building backend systems','Senior Engineer at Qualcomm building backend systems')
s=s.replace('I’m a Software Development Engineer with a focus on backend systems, automation, and applied AI.','I’m a Senior Engineer at Qualcomm in Chennai, focused on code intelligence, backend systems, automation, and applied AI.')
s=s.replace('At Truminds, I’ve worked across telecom testing systems, large-scale code analysis, and LLM-based developer tooling.','At Qualcomm, I extend the Quartz code intelligence platform with SystemC support, component search, MCP workflows, and integrations across SDK and backend layers. Previously at Truminds, I worked across telecom testing systems, large-scale code analysis, and LLM-based developer tooling.')
s=s.replace('Developed 40+ telecom test cases','Developed 47+ telecom test cases')
p.write_text(s,encoding='utf-8')
shutil.copyfile('output/pdf/R Avaneesh_Resume_Updated.pdf','public/resume.pdf')
print('Updated experience, homepage, and downloadable resume.')
