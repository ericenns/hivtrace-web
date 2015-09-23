import os
from flask import Flask
from flask import current_app, jsonify, make_response, redirect, request, render_template, url_for
from werkzeug.utils import secure_filename
import shutil
import subprocess
import uuid

__basedir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(__basedir, 'uploads')
RESULTS_FOLDER = os.path.join(__basedir, 'results')
app = Flask(__name__)
ALLOWED_EXTENSIONS = set(['fasta', 'fas', 'fa'])

def allowed_file(filename):
    return '.' in filename and filename.lower().rsplit('.',1)[1] in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/analyse', methods=['POST'])
def analyse():
    prealigned = False
    query_file_path = None
    reference = request.form['reference']
    analysis_uuid = str(uuid.uuid4())
    upload_dir = os.path.join(UPLOAD_FOLDER, analysis_uuid)
    results_dir = os.path.join(RESULTS_FOLDER, analysis_uuid)
    os.mkdir(upload_dir)
    os.mkdir(results_dir)

    for fileid in request.files:
        if fileid == 'aligned_seq_file':
            prealigned = True
            if allowed_file(request.files[fileid].filename):
                filename = secure_filename(request.files[fileid].filename)
                query_file_path = os.path.join(upload_dir, filename)
                request.files[fileid].save(query_file_path)
        elif fileid == 'seq_file':
            if allowed_file(request.files[fileid].filename):
                filename = secure_filename(request.files[fileid].filename)
                query_file_path = os.path.join(upload_dir, filename)
                request.files[fileid].save(query_file_path)
        elif fileid == 'reference_file':
            if allowed_file(request.files[fileid].filename):
                filename = secure_filename(request.files[fileid].filename)
                reference = os.path.join(upload_dir, filename)
                request.files[fileid].save(reference)

    command = ["hivtrace", "-i", query_file_path, "-a", request.form['ambiguity_handling'], "-r", reference, "-t", request.form['distance_threshold'], "-m", request.form['min_overlap'], "-g", request.form['fraction'], "-u", request.form['reference_strip'], "-f", request.form['filter_edges'], "-s", request.form['strip_drams']]

    if 'public_db_compare' in request.form:
        command.append('-c')

    if prealigned:
        command.append('--skip-alignment')

    current_app.logger.info(' '.join(command))
    process = subprocess.Popen(command, stdout=subprocess.PIPE)

    result_json = process.stdout.read().rstrip().decode("utf-8")

    # output json to file
    f = open(os.path.join(results_dir, 'results.json'), 'w')
    f.write(result_json)
    f.close()

    # move alignment
    shutil.move(query_file_path + "_output.fasta", os.path.join(results_dir, 'alignment.fasta'))

    print(url_for('analysis', analysis_uuid=analysis_uuid))
    return redirect(url_for('analysis', analysis_uuid=analysis_uuid))

@app.route('/analysis/<analysis_uuid>')
def analysis(analysis_uuid):
    results_dir = os.path.join(RESULTS_FOLDER, analysis_uuid)

    f = open(os.path.join(results_dir, 'results.json'))
    result_json = f.read().rstrip()

    return render_template('analysis.html', results=result_json, analysis_uuid=analysis_uuid)

@app.route('/analysis/<analysis_uuid>/alignment')
def analysis_alignment(analysis_uuid):
    results_dir = os.path.join(RESULTS_FOLDER, analysis_uuid)

    f = open(os.path.join(results_dir, 'alignment.fasta'))
    data = f.read()

    response = make_response(data)
    response.headers["Content-Disposition"] = "attachment; filename=alignment.fasta"
    return response

@app.route('/copyright_notice')
def copyright_notice():
    return render_template('copyright_notice.html')

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True)
