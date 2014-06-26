call mvn eclipse:clean
call mvn eclipse:eclipse -DdownloadSources=true -DdownloadJavadocs=true

mvn dependency:sources
mvn dependency:resolve -Dclassifier=javadoc
@pause